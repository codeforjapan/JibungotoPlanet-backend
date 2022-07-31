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
    'reduction-rate'
  ])

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
    }
    results.get(action.key).actions.set(action.option, action) // actionを登録
  }

  //
  // 削減によって影響を受ける他のitemのvalueを更新
  //
  const phase2 = new Set([
    'proportional-to-other-items',
    'shift-from-other-items'
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
    }
    results.get(action.key).actions.set(action.option, action) // actionを登録
  }

  //
  // 削減によって影響を受ける他のitemのvalueを更新(footprintの計算が必要なもの)
  //
  const phase3 = new Set([
    'further-reduction-from-other-footprints',
    'proportional-to-other-footprints',
    'question-answer-to-target',
    'question-answer-to-target-inverse',
    'question-reduction-rate',
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
      case 'question-answer-to-target':
      case 'question-answer-to-target-inverse':
      case 'question-reduction-rate':
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
      /*
      if (
        action.option === 'ec' &&
        action.key === 'housing_electricity_amount'
      ) {
        console.log(
          key +
            ' : ' +
            action.option +
            ':' +
            action.key +
            ' : after =' +
            after +
            ', before = ' +
            before +
            ' : value = ' +
            value
        )
      }*/
    }
    return sum + value
  }, 0)
  /*
  if (action.option === 'ec') {
    console.log(
      action.option +
        ':' +
        action.key +
        ':' +
        sum +
        ',' +
        action.optionValue +
        ' <- ' +
        action.value
    )
  }
    */
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
    const ab = results.get(key + '_amount')?.estimation?.value || 0
    let aa = results.get(key + '_amount')?.actions.get(action.option)?.value

    const ib = results.get(key + '_intensity')?.estimation?.value || 0
    let ia = results.get(key + '_intensity')?.actions.get(action.option)?.value

    if (aa === null || aa === undefined) {
      aa = ab
    }
    if (ia === null || ia === undefined) {
      ia = ib
    }

    /*
    if (
      action.option === 'white-meat-fish' &&
      action.key === 'food_restaurant_intensity'
    ) {
      console.log(
        key +
          ' : ' +
          action.option +
          ':' +
          action.key +
          ', amountBefore = ' +
          ab +
          ' : amountAfter =' +
          aa +
          ', intensityBefore = ' +
          ib +
          ' : intensityAfter =' +
          ia
      )
    }
    */

    sumBefore += ab * ib
    sumAfter += aa * ia
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
    const ab = results.get(key + '_amount')?.estimation?.value || 0
    let aa = results.get(key + '_amount')?.actions.get(action.option)?.value
    const ib = results.get(key + '_intensity')?.estimation?.value || 0
    let ia = results.get(key + '_intensity')?.actions.get(action.option)?.value

    if (aa === null || aa === undefined) {
      aa = ab
    }
    if (ia === null || ia === undefined) {
      ia = ib
    }

    /*
    if (
      action.option === 'ac' &&
      action.key === 'housing_housing-maintenance_amount'
    ) {
      console.log(
        key +
          ' : ' +
          action.option +
          ':' +
          action.key +
          ', amountBefore = ' +
          ab +
          ' : amountAfter =' +
          aa +
          ', intensityBefore = ' +
          ib +
          ' : intensityAfter =' +
          ia
      )
    }
    */

    sumBefore += ab * ib
    sumAfter += aa * ia
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

  /*
  if (action.option === 'ac') {
    console.log(
      action.key +
        ' -> ' +
        action.item +
        ':' +
        action.type +
        ':' +
        action.value +
        ', amount = ' +
        amount +
        ', intensity = ' +
        intensity +
        'sumAfter = ' +
        sumAfter +
        'sumBefore = ' +
        sumBefore +
        'optionValue = ' +
        action.optionValue
    )
  }
  */
}

export { calculateActions }
