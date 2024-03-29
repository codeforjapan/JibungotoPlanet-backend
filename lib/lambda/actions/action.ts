import { toEstimation } from './util'

// dynamodbのレコードをoptionへの変換
const toOption = (rec: { domain_item_type: string; option: any; value: any; args: any; operation: any }) => {
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
  dynamodb: { scan: (arg0: { TableName: any }) => { (): any; new(): any; promise: { (): any; new(): any } } },
  baselines: any,
  estimations: any,
  housingAnswer: any,
  mobilityAnswer: any,
  foodAnswer: any,
  parameterTableName: string,
  optionTableName: string
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
  const toAction = (option: { key: any; option: any; value: any; args: any; operation: any; }) => {
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
  const actions = optionData.Items.map((item: { domain_item_type: string; option: any; value: any; args: any; operation: any; }) => toOption(item))
    .filter((option: { key: any; }) => results.has(option.key))
    .map((option: { key: any; option: any; value: any; args: any; operation: any; }) => toAction(option))

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

  // @ts-ignore
  let questionAnswerToTargetParams: {
    carDrivingIntensity: number | null
    carManufacturingIntensity: number | null
    foodPurchaseAmountConsideringFoodLossRatio: number | null
  } = null

  // @ts-ignore
  let questionReductionRateParams: {
    renovationHousingInsulation: number | null
    clothingHousingInsulation: number | null
  } = null

  // @ts-ignore
  let questionAnswerToTargetInverseParams: {
    taxiPassengers: number | null
    privateCarPassengers: number | null
  } = null

  for (const action of actions.filter((action: { operation: string; }) =>
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
        if (questionAnswerToTargetInverseParams === null) {
          questionAnswerToTargetInverseParams = {
            taxiPassengers: await calcTaxiPassengers(
              dynamodb,
              mobilityAnswer,
              parameterTableName
            ),
            privateCarPassengers: await calcPrivateCarPassengers(
              dynamodb,
              mobilityAnswer,
              parameterTableName
            )
          }
        }
        await questionAnswerToTargetInverse(
          action,
          questionAnswerToTargetInverseParams.taxiPassengers,
          questionAnswerToTargetInverseParams.privateCarPassengers
        )
        break
      case 'question-answer-to-target':
        if (questionAnswerToTargetParams === null) {
          questionAnswerToTargetParams = {
            carDrivingIntensity: await calcCarDrivingIntensity(
              dynamodb,
              housingAnswer,
              mobilityAnswer,
              parameterTableName
            ),
            carManufacturingIntensity: await calcCarManufacturingIntensity(
              dynamodb,
              mobilityAnswer,
              parameterTableName
            ),
            foodPurchaseAmountConsideringFoodLossRatio:
              await calcFoodPurchaseAmountConsideringFoodLossRatio(
                dynamodb,
                foodAnswer,
                parameterTableName
              )
          }
        }

        await questionAnswerToTarget(
          action,
          questionAnswerToTargetParams.carDrivingIntensity,
          questionAnswerToTargetParams.carManufacturingIntensity,
          questionAnswerToTargetParams.foodPurchaseAmountConsideringFoodLossRatio
        )
        break
      case 'question-reduction-rate':
        if (questionReductionRateParams === null) {
          questionReductionRateParams = {
            renovationHousingInsulation: await calcRenovationHousingInsulation(
              dynamodb,
              housingAnswer,
              parameterTableName
            ),
            clothingHousingInsulation: await calcClothingHousingInsulation(
              dynamodb,
              housingAnswer,
              parameterTableName
            )
          }
        }
        await questionReductionRate(
          action,
          questionReductionRateParams.renovationHousingInsulation,
          questionReductionRateParams.clothingHousingInsulation
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

  for (const action of actions.filter((action: { operation: string; }) =>
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

  for (const action of actions.filter((action: { operation: string; }) =>
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
  return actions.map((action: { option: any; domain: any; item: any; type: any; subdomain: any; value: any; unit: any; }) => ({
    option: action.option,
    domain: action.domain,
    item: action.item,
    type: action.type,
    subdomain: action.subdomain,
    value: action.value,
    unit: action.unit
  }))
}

// [削減後] = [value]
const absoluteTarget = (action: { value: any; optionValue: any; }) => {
  action.value = action.optionValue
}

// [削減後] = [削減前] + [value]
const addAmount = (action: { value: any; optionValue: any; }) => {
  action.value += action.optionValue
}

// [削減後] = [削減前] x (1+[value])
const increaseRate = (action: { value: number; optionValue: number; }) => {
  action.value *= 1 + action.optionValue
}

// [削減後] = [削減前] - Σ([valueに指定した複数項目の削減後]-[valueで指定した複数項目の削減前]) x [value2で指定した代替率]
const shiftFromOtherItems = (action: { args: any[]; option: any; value: number; optionValue: number; }, results: Map<any, any>) => {
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
const proportionalToOtherItems = (action: { args: any; option: any; value: number; optionValue: number; }, results: Map<any, any>) => {
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
const proportionalToOtherFootprints = (action: { args: any; option: any; value: number; optionValue: number; }, results: Map<any, any>) => {
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

const reboundFromOtherFootprints = (action: any, results: Map<any, any>) => {
  furtherReductionFromOtherFootprints(action, results, 1)
}

// [削減後] = [削減前] + (Σ[valueで指定したフットプリントの削減後] - Σ[valueで指定したフットプリントの削減前]) x [value2で指定したリバウンド割合]
const furtherReductionFromOtherFootprints = (action: { args: any; option: any; type: string; value: number; key: string; optionValue: number; }, results: Map<any, any>, sign = -1) => {
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

const getData = async (dynamodb: any, parameterTableName: any, category: string, key: string) =>
  await dynamodb
    .get({
      TableName: parameterTableName,
      Key: {
        category: category,
        key: key
      }
    })
    .promise()

const calcTaxiPassengers = async (
  dynamodb: { scan?: (arg0: { TableName: any; }) => { (): any; new(): any; promise: { (): any; new(): any; }; }; get?: (arg0: { TableName: any; Key: { category: any; key: any; }; }) => { (): any; new(): any; promise: { (): any; new(): any; }; }; },
  mobilityAnswer: { carPassengersFirstKey: any; },
  parameterTableName: string
) => {
  const data = await getData(
    dynamodb,
    parameterTableName,
    'car-passengers',
    (mobilityAnswer?.carPassengersFirstKey || 'unknown') + '_taxi-passengers'
  )
  return data?.Item ? data.Item.value : null
}

const calcPrivateCarPassengers = async (
  dynamodb: { scan?: (arg0: { TableName: any; }) => { (): any; new(): any; promise: { (): any; new(): any; }; }; get?: (arg0: { TableName: any; Key: { category: any; key: any; }; }) => { (): any; new(): any; promise: { (): any; new(): any; }; }; },
  mobilityAnswer: { carPassengersFirstKey: any; },
  parameterTableName: string
) => {
  // 乗車人数補正
  const data = await getData(
    dynamodb,
    parameterTableName,
    'car-passengers',
    (mobilityAnswer.carPassengersFirstKey || 'unknown') +
    '_private-car-passengers'
  )
  return data?.Item ? data.Item.value : null
}

// rideshareだけなのでrideshareに特化した実装
const questionAnswerToTargetInverse = async (
  action: { args: string[]; value: number; optionValue: number; },
  taxiPassengers: number | null,
  privateCarPassengers: number | null
) => {
  if (action.args[0] === 'mobility_taxi-car-passengers') {
    if (taxiPassengers != null) {
      action.value *= taxiPassengers / action.optionValue
    }
  } else {
    if (privateCarPassengers != null) {
      action.value *= privateCarPassengers / action.optionValue
    }
  }
}

// car-driving-intensityの取得
const calcCarDrivingIntensity = async (
  dynamodb: { scan?: (arg0: { TableName: any; }) => { (): any; new(): any; promise: { (): any; new(): any; }; }; get?: (arg0: { TableName: any; Key: { category: any; key: any; }; }) => { (): any; new(): any; promise: { (): any; new(): any; }; }; },
  housingAnswer: { electricityIntensityKey: string; },
  mobilityAnswer: { carChargingKey: any; carIntensityFactorFirstKey: string; },
  parameterTableName: string
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
  dynamodb: { scan?: (arg0: { TableName: any; }) => { (): any; new(): any; promise: { (): any; new(): any; }; }; get?: (arg0: { TableName: any; Key: { category: any; key: any; }; }) => { (): any; new(): any; promise: { (): any; new(): any; }; }; },
  mobilityAnswer: { carIntensityFactorFirstKey: any; },
  parameterTableName: string
) => {
  // 製造次元単位補正
  const data = await getData(
    dynamodb,
    parameterTableName,
    'car-intensity-factor',
    (mobilityAnswer?.carIntensityFactorFirstKey || 'unknown') +
    '_manufacturing-intensity'
  )
  return data?.Item ? data.Item.value : null
}

const calcFoodPurchaseAmountConsideringFoodLossRatio = async (
  dynamodb: { scan?: (arg0: { TableName: any; }) => { (): any; new(): any; promise: { (): any; new(): any; }; }; query?: any; get?: (arg0: { TableName: any; Key: { category: any; key: any; }; }) => { (): any; new(): any; promise: { (): any; new(): any; }; }; },
  foodAnswer: { foodDirectWasteFactorKey: string; foodLeftoverFactorKey: string; },
  parameterTableName: string
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
      (item: { key: string; }) => item.key === 'leftover-per-food-waste'
    )
    const directWasteRatio = foodWastRatio.Items.find(
      (item: { key: string; }) => item.key === 'direct-waste-per-food-waste'
    )
    const foodWasteRatio = foodWastRatio.Items.find(
      (item: { key: string; }) => item.key === 'food-waste-per-food'
    )

    const foodLossAverageRatio =
      foodDirectWasteFactor.Item?.value * directWasteRatio.value +
      foodLeftoverFactor.Item?.value * leftoverRatio.value

    // 全体に影響する割合
    // 食品ロスを考慮した食材購入量の平均に対する比率
    return (
      (1 + foodLossAverageRatio * foodWasteRatio.value) /
      (1 + foodWasteRatio.value)
    )
  }
  return null
}

// car-ev-phv, car-ev-phv-re, lossで適用。
// argsは、mobility_driving-intensity, mobility_manufacturing-intensity, food_food-amount-to-average
const questionAnswerToTarget = async (
  action: { args: string[]; value: number; optionValue: number; },
  carDrivingIntensity: number | null,
  carManufacturingIntensity: number | null,
  foodPurchaseAmountConsideringFoodLossRatio: number | null
) => {
  if (action.args[0] === 'mobility_driving-intensity') {
    if (carDrivingIntensity != null) {
      action.value *= action.optionValue / carDrivingIntensity
    }
  } else if (action.args[0] === 'mobility_manufacturing-intensity') {
    if (carManufacturingIntensity != null) {
      action.value *= action.optionValue / carManufacturingIntensity
    }
  } else if (action.args[0] === 'food_food-amount-to-average') {
    if (foodPurchaseAmountConsideringFoodLossRatio != null) {
      action.value *=
        action.optionValue / foodPurchaseAmountConsideringFoodLossRatio
    }
  }
}

const calcRenovationHousingInsulation = async (
  dynamodb: { scan?: (arg0: { TableName: any; }) => { (): any; new(): any; promise: { (): any; new(): any; }; }; get?: (arg0: { TableName: any; Key: { category: any; key: any; }; }) => { (): any; new(): any; promise: { (): any; new(): any; }; }; },
  housingAnswer: { housingInsulationFirstKey: any; },
  parameterTableName: string
) => {
  const data = await getData(
    dynamodb,
    parameterTableName,
    'housing-insulation',
    (housingAnswer?.housingInsulationFirstKey || 'unknown') + '_renovation'
  )
  return data?.Item ? data.Item.value : null
}

const calcClothingHousingInsulation = async (
  dynamodb: { scan?: (arg0: { TableName: any; }) => { (): any; new(): any; promise: { (): any; new(): any; }; }; get?: (arg0: { TableName: any; Key: { category: any; key: any; }; }) => { (): any; new(): any; promise: { (): any; new(): any; }; }; },
  housingAnswer: { housingInsulationFirstKey: any; },
  parameterTableName: string
) => {
  const data = await getData(
    dynamodb,
    parameterTableName,
    'housing-insulation',
    (housingAnswer?.housingInsulationFirstKey || 'unknown') + '_clothing'
  )
  return data?.Item ? data.Item.value : null
}

// insrenov, clothes-homeのみ
const questionReductionRate = async (
  action: { args: string[]; value: number; optionValue: number; },
  renovationHousingInsulation: number | null,
  clothingHousingInsulation: number | null
) => {
  if (action.args[0] === 'housing_housing-insulation-renovation') {
    if (renovationHousingInsulation != null) {
      action.value *= 1 + action.optionValue * renovationHousingInsulation
    }
  } else if (action.args[0] === 'housing_housing-insulation-clothing') {
    if (clothingHousingInsulation != null) {
      action.value *= 1 + action.optionValue * clothingHousingInsulation
    }
  }
}

// zeh用の計算
const shiftFromOtherItemsThenReductionRate = (action: any, results: Map<any, any>) => {
  const value2 = Number.parseFloat(action.args[0])
  const args = action.args.slice(1)

  const sum = args.reduce((sum: number, key: any) => {
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
