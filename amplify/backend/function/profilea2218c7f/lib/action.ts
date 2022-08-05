import { toEstimation } from './util'

// dynamodbのレコードをoptionへの変換
const toOption = (rec) => {
  const domain_item_type = rec.domain_item_type.split('_')
  return {
    key: rec.domain_item_type,
    option: rec.option,
    domain: domain_item_type[0],
    item: domain_item_type[1],
    type: domain_item_type[2],
    value: rec.value,
    args: rec.args,
    operation: rec.operation
  }
}

const calculateActions = async (
  dynamodb,
  baselines,
  estimations,
  housingAnswer,
  mobilityAnswer,
  foodAnswer,
  parameterTableName,
  optionTableName
) => {
  // baselinesとestimationsを合成した辞書を作成
  const results = new Map()
  for (const baseline of baselines) {
    results.set(baseline.domain + '_' + baseline.item + '_' + baseline.type, {
      actions: new Map(),
      estimation: toEstimation(baseline),
      baseline: baseline
    })
  }
  // estimationを上書き
  for (const estimation of estimations) {
    const key =
      estimation.domain + '_' + estimation.item + '_' + estimation.type
    const result = results.get(key)
    result.estimation = estimation
    results.set(key, result)
  }

  // optionをactionへ変換
  const toAction = (option) => {
    const result = results.get(option.key)
    return {
      key: option.key,
      ...result.estimation,
      option: option.option,
      optionValue: option.value,
      args: option.args,
      operation: option.operation
    }
  }

  // オプションを取得（このプロジェクトでは問題ないが、データが1MB以上の時は以下のコードだと1MB以上の部分が欠損）
  const optionData = await dynamodb
    .scan({
      TableName: optionTableName
    })
    .promise()

  // resultがある場合にactionを作成
  const actions = optionData.Items.map((item) => toOption(item))
    .filter((option) => results.has(option.key))
    .map((option) => toAction(option))

  //
  // 削減施策計算のメイン処理
  //

  //
  // 単純な削減代を計算
  //
  const phase1 = new Set([
    'absolute-target',
    'add-amount',
    'increase-rate',
    'reduction-rate',
    'question-reduction-rate',
    'question-answer-to-target',
    'question-answer-to-target-inverse'
  ])

  let questionAnswerToTargetParamsCalculated = false
  let carDrivingIntensity = null
  let carManufacturingIntensity = null
  let foodPurchaseAmountConsideringFoodLossRatio = null

  for (const action of actions.filter((action) =>
    phase1.has(action.operation)
  )) {
    switch (action.operation) {
      case 'absolute-target':
        absoluteTarget(action)
        break
      case 'add-amount':
        addAmount(action)
        break
      case 'increase-rate':
      case 'reduction-rate':
        increaseRate(action)
        break
      case 'question-answer-to-target-inverse':
        await questionAnswerToTargetInverse(
          action,
          dynamodb,
          mobilityAnswer,
          parameterTableName
        )
        break
      case 'question-answer-to-target':
        if (questionAnswerToTargetParamsCalculated === false) {
          questionAnswerToTargetParamsCalculated = true
          carDrivingIntensity = await calcCarDrivingIntensity(
            dynamodb,
            housingAnswer,
            mobilityAnswer,
            parameterTableName
          )
          carManufacturingIntensity = await calcCarManufacturingIntensity(
            dynamodb,
            mobilityAnswer,
            parameterTableName
          )
          foodPurchaseAmountConsideringFoodLossRatio =
            await calcFoodPurchaseAmountConsideringFoodLossRatio(
              dynamodb,
              foodAnswer,
              parameterTableName
            )
        }

        await questionAnswerToTarget(
          action,
          carDrivingIntensity,
          carManufacturingIntensity,
          foodPurchaseAmountConsideringFoodLossRatio
        )
        break
      case 'question-reduction-rate':
        await questionReductionRate(
          action,
          dynamodb,
          housingAnswer,
          parameterTableName
        )
        break
    }
    results.get(action.key).actions.set(action.option, action) // actionを登録
  }

  //
  // 削減によって影響を受ける他のitemのvalueを更新
  //
  const phase2 = new Set([
    'proportional-to-other-items',
    'shift-from-other-items',
    'shift-from-other-items-then-reduction-rate'
  ])

  for (const action of actions.filter((action) =>
    phase2.has(action.operation)
  )) {
    switch (action.operation) {
      case 'shift-from-other-items':
        shiftFromOtherItems(action, results)
        break
      case 'proportional-to-other-items':
        proportionalToOtherItems(action, results)
        break
      case 'shift-from-other-items-then-reduction-rate':
        shiftFromOtherItemsThenReductionRate(action, results)
        break
    }
    results.get(action.key).actions.set(action.option, action) // actionを登録
  }

  //
  // 削減によって影響を受ける他のitemのvalueを更新(footprintの計算が必要なもの)
  //
  const phase3 = new Set([
    'further-reduction-from-other-footprints',
    'proportional-to-other-footprints',
    'rebound-from-other-footprints'
  ])

  for (const action of actions.filter((action) =>
    phase3.has(action.operation)
  )) {
    switch (action.operation) {
      case 'proportional-to-other-footprints':
        proportionalToOtherFootprints(action, results)
        break
      case 'further-reduction-from-other-footprints':
        furtherReductionFromOtherFootprints(action, results)
        break
      case 'rebound-from-other-footprints':
        reboundFromOtherFootprints(action, results)
        break
    }
    results.get(action.key).actions.set(action.option, action) // actionを登録
  }

  // keyを削除してactionsを返す
  return actions.map((action) => {
    action.key = undefined
    return action
  })
}

// [削減後] = [value]
const absoluteTarget = (action) => {
  action.value = action.optionValue
}

// [削減後] = [削減前] + [value]
const addAmount = (action) => {
  action.value += action.optionValue
}

// [削減後] = [削減前] x (1+[value])
const increaseRate = (action) => {
  action.value *= 1 + action.optionValue
}

// [削減後] = [削減前] - Σ([valueに指定した複数項目の削減後]-[valueで指定した複数項目の削減前]) x [value2で指定した代替率]
const shiftFromOtherItems = (action, results) => {
  const sum = action.args.reduce((sum, key) => {
    const result = results.get(key)
    let value = 0
    if (result) {
      const before = result.estimation?.value
      const after = result.actions.get(action.option)?.value
      if (
        before !== null &&
        before !== undefined &&
        after !== null &&
        after !== undefined
      ) {
        value = after - before
      }
    }
    return sum + value
  }, 0)
  action.value -= sum * action.optionValue
}

// [削減後] = [削減前] x (1-[value2で指定した影響割合])
//  + [削減前] x [value2で指定した影響割合] x (Σ[valueで指定した複数項目の削減後] /Σ[valueで指定した複数項目の削減前])
const proportionalToOtherItems = (action, results) => {
  let sumBefore = 0
  let sumAfter = 0
  for (const key of action.args) {
    const before = results.get(key)?.estimation?.value || 0
    let after = results.get(key)?.actions.get(action.option)?.value
    if (after === null || after === undefined) {
      after = before
    }

    sumBefore += before
    sumAfter += after
  }

  if (sumBefore !== 0) {
    action.value =
      action.value * (1 - action.optionValue) +
      action.value * action.optionValue * (sumAfter / sumBefore)
  }
}

// [削減後] = [削減前] x (1-[value2で指定した影響割合])
//  + [削減前] x [value2で指定した影響割合] x ([valueで指定したフットプリントの削減後] / [valueで指定したフットプリントの削減前])
const proportionalToOtherFootprints = (action, results) => {
  let sumBefore = 0
  let sumAfter = 0
  for (const key of action.args) {
    const amountBefore = results.get(key + '_amount')?.estimation?.value || 0
    let amountAfter = results
      .get(key + '_amount')
      ?.actions.get(action.option)?.value

    const intensityBefore =
      results.get(key + '_intensity')?.estimation?.value || 0
    let intensityAfter = results
      .get(key + '_intensity')
      ?.actions.get(action.option)?.value

    if (amountAfter === null || amountAfter === undefined) {
      amountAfter = amountBefore
    }
    if (intensityAfter === null || intensityAfter === undefined) {
      intensityAfter = intensityBefore
    }

    sumBefore += amountBefore * intensityBefore
    sumAfter += amountAfter * intensityAfter
  }
  if (sumBefore !== 0) {
    action.value =
      action.value * (1 - action.optionValue) +
      action.value * action.optionValue * (sumAfter / sumBefore)
  }
}

const reboundFromOtherFootprints = (action, results) => {
  furtherReductionFromOtherFootprints(action, results, 1)
}

// [削減後] = [削減前] + (Σ[valueで指定したフットプリントの削減後] - Σ[valueで指定したフットプリントの削減前]) x [value2で指定したリバウンド割合]
const furtherReductionFromOtherFootprints = (action, results, sign = -1) => {
  let sumBefore = 0
  let sumAfter = 0
  for (const key of action.args) {
    const amountBefore = results.get(key + '_amount')?.estimation?.value || 0
    let amountAfter = results
      .get(key + '_amount')
      ?.actions.get(action.option)?.value
    const intensityBefore =
      results.get(key + '_intensity')?.estimation?.value || 0
    let intensityAfter = results
      .get(key + '_intensity')
      ?.actions.get(action.option)?.value

    if (amountAfter === null || amountAfter === undefined) {
      amountAfter = amountBefore
    }
    if (intensityAfter === null || intensityAfter === undefined) {
      intensityAfter = intensityBefore
    }

    sumBefore += amountBefore * intensityBefore
    sumAfter += amountAfter * intensityAfter
  }

  let amount = 0
  let intensity = 0
  let denominator = 1

  if (action.type === 'amount') {
    amount = action.value
    intensity = results.get(action.key.replace('_amount', '_intensity'))
      .estimation.value
    denominator = intensity
  } else {
    intensity = action.value
    amount = results.get(action.key.replace('_intensity', '_amount')).estimation
      .value
    denominator = amount
  }

  action.value =
    (amount * intensity + sign * (sumAfter - sumBefore) * action.optionValue) /
    denominator
}

const getData = async (dynamodb, parameterTableName, category, key) =>
  await dynamodb
    .get({
      TableName: parameterTableName,
      Key: {
        category: category,
        key: key
      }
    })
    .promise()

// rideshareだけなのでrideshareに特化した実装
const questionAnswerToTargetInverse = async (
  action,
  dynamodb,
  mobilityAnswer,
  parameterTableName
) => {
  if (action.args[0] === 'mobility_taxi-car-passengers') {
    // 乗車人数補正
    const data = await getData(
      dynamodb,
      parameterTableName,
      'car-passengers',
      (mobilityAnswer?.carPassengersFirstKey || 'unknown') + '_taxi-passengers'
    )
    if (data?.Item?.value) {
      action.value *= data?.Item?.value / action.optionValue
    }
  } else {
    // 乗車人数補正
    const data = await getData(
      dynamodb,
      parameterTableName,
      'car-passengers',
      (mobilityAnswer.carPassengersFirstKey || 'unknown') +
        '_private-car-passengers'
    )
    if (data?.Item) {
      action.value *= data.Item.value / action.optionValue
    }
  }
}

// car-driving-intensityの取得
const calcCarDrivingIntensity = async (
  dynamodb,
  housingAnswer,
  mobilityAnswer,
  parameterTableName
) => {
  let electricityIntensityFactor = 0

  // PHV, EVの場合は自宅での充電割合と再生エネルギー電力の割合で補正
  if (housingAnswer?.electricityIntensityKey) {
    const electricityData = await getData(
      dynamodb,
      parameterTableName,
      'electricity-intensity-factor',
      housingAnswer.electricityIntensityKey
    )
    if (electricityData?.Item) {
      electricityIntensityFactor = electricityData.Item.value
    }

    const carChargingData = await getData(
      dynamodb,
      parameterTableName,
      'car-charging',
      mobilityAnswer?.carChargingKey || 'unknown'
    )
    if (carChargingData?.Item) {
      electricityIntensityFactor *= carChargingData.Item.value
    }
  }

  // 自家用車の場合は、自動車種類に応じて運転時GHG原単位を取得
  let ghgIntensity = 1
  let data = await getData(
    dynamodb,
    parameterTableName,
    'car-intensity-factor',
    (mobilityAnswer?.carIntensityFactorFirstKey || 'unknown') +
      '_driving-intensity'
  )
  if (data?.Item) {
    ghgIntensity = data.Item.value
  }

  // PHV, EVの補正
  if (
    mobilityAnswer?.carIntensityFactorFirstKey === 'phv' ||
    mobilityAnswer?.carIntensityFactorFirstKey === 'ev'
  ) {
    const data = await getData(
      dynamodb,
      parameterTableName,
      'renewable-car-intensity-factor',
      (mobilityAnswer?.carIntensityFactorFirstKey || 'unknown') +
        '_driving-factor'
    )

    if (data?.Item) {
      ghgIntensity =
        ghgIntensity * (1 - electricityIntensityFactor) +
        data.Item.value * electricityIntensityFactor
    }
  }
  return ghgIntensity
}

// car-manufacturing-intensityの取得
const calcCarManufacturingIntensity = async (
  dynamodb,
  mobilityAnswer,
  parameterTableName
) => {
  // 製造次元単位補正
  const data = await getData(
    dynamodb,
    parameterTableName,
    'car-intensity-factor',
    (mobilityAnswer?.carIntensityFactorFirstKey || 'unknown') +
      '_manufacturing-intensity'
  )
  if (data?.Item) {
    return data.Item.value
  } else {
    return null
  }
}

const calcFoodPurchaseAmountConsideringFoodLossRatio = async (
  dynamodb,
  foodAnswer,
  parameterTableName
) => {
  if (
    foodAnswer?.foodDirectWasteFactorKey &&
    foodAnswer?.foodLeftoverFactorKey
  ) {
    const foodDirectWasteFactor = await getData(
      dynamodb,
      parameterTableName,
      'food-direct-waste-factor',
      foodAnswer.foodDirectWasteFactorKey
    )

    const foodLeftoverFactor = await getData(
      dynamodb,
      parameterTableName,
      'food-leftover-factor',
      foodAnswer.foodLeftoverFactorKey
    )

    const foodWastRatio = await dynamodb
      .query({
        TableName: parameterTableName,
        KeyConditions: {
          category: {
            ComparisonOperator: 'EQ',
            AttributeValueList: ['food-waste-share']
          }
        }
      })
      .promise()

    const leftoverRatio = foodWastRatio.Items.find(
      (item) => item.key === 'leftover-per-food-waste'
    )
    const directWasteRatio = foodWastRatio.Items.find(
      (item) => item.key === 'direct-waste-per-food-waste'
    )
    const foodWasteRatio = foodWastRatio.Items.find(
      (item) => item.key === 'food-waste-per-food'
    )

    const foodLossAverageRatio =
      foodDirectWasteFactor.Item?.value * directWasteRatio.value +
      foodLeftoverFactor.Item?.value * leftoverRatio.value

    // 全体に影響する割合
    // 食品ロスを考慮した食材購入量の平均に対する比率
    const foodPurchaseAmountConsideringFoodLossRatio =
      (1 + foodLossAverageRatio * foodWasteRatio.value) /
      (1 + foodWasteRatio.value)
    return foodPurchaseAmountConsideringFoodLossRatio
  }
  return null
}

// car-ev-phv, car-ev-phv-re, lossで適用。
// argsは、mobility_driving-intensity, mobility_manufacturing-intensity, food_food-amount-to-average
const questionAnswerToTarget = async (
  action,
  carDrivingIntensity,
  carManufacturingIntensity,
  foodPurchaseAmountConsideringFoodLossRatio
) => {
  if (action.args[0] === 'mobility_driving-intensity') {
    if (carDrivingIntensity) {
      action.value *= action.optionValue / carDrivingIntensity
    }
  } else if (action.args[0] === 'mobility_manufacturing-intensity') {
    action.value *= action.optionValue / carManufacturingIntensity
  } else if (action.args[0] === 'food_food-amount-to-average') {
    if (foodPurchaseAmountConsideringFoodLossRatio) {
      action.value *=
        action.optionValue / foodPurchaseAmountConsideringFoodLossRatio
    }
  }
}

// insrenov, clothes-homeのみ
const questionReductionRate = async (
  action,
  dynamodb,
  housingAnswer,
  parameterTableName
) => {
  if (action.args[0] === 'housing_housing-insulation-renovation') {
    const data = await getData(
      dynamodb,
      parameterTableName,
      'housing-insulation',
      (housingAnswer.housingInsulationFirstKey || 'unknown') + '_renovation'
    )
    if (data?.Item) {
      action.value *= 1 + action.optionValue * data.Item.value
    }
  } else if (action.args[0] === 'housing_housing-insulation-clothing') {
    const data = await getData(
      dynamodb,
      parameterTableName,
      'housing-insulation',
      (housingAnswer.housingInsulationFirstKey || 'unknown') + '_clothing'
    )
    if (data?.Item) {
      action.value *= 1 + action.optionValue * data.Item.value
    }
  }
}

// zeh用の計算
const shiftFromOtherItemsThenReductionRate = (action, results) => {
  const value2 = Number.parseFloat(action.args[0])
  const args = action.args.slice(1)

  const sum = args.reduce((sum, key) => {
    const result = results.get(key)
    let value = 0
    if (result) {
      const before = result.estimation?.value
      const after = result.actions.get(action.option)?.value
      if (
        before !== null &&
        before !== undefined &&
        after !== null &&
        after !== undefined
      ) {
        value = after - before
      }
    }
    return sum + value
  }, 0)

  action.value =
    (action.value / action.optionValue - sum) *
    (1 + value2) *
    action.optionValue
}

export { calculateActions }
