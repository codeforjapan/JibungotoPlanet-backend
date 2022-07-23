import { toBaseline, findBaseline, toEstimation } from './util'

const estimateHousing = async (
  dynamodb,
  housingAnswer,
  footprintTableName,
  parameterTableName
) => {
  const getData = async (category, key) =>
    await dynamodb
      .get({
        TableName: parameterTableName,
        Key: {
          category: category,
          key: key
        }
      })
      .promise()

  /* eslint-disable no-unused-vars */
  const pushOrUpdateEstimate = (item, type, estimation) => {
    const estimate = estimations.find(
      (estimation) => estimation.item === item && estimation.type === type
    )
    if (estimate) {
      estimate.value = estimation.value
    } else {
      estimations.push(estimation)
    }
  }
  /* eslint-disable no-unused-vars */

  // housingAnswerのスキーマと取りうる値は以下を参照
  // amplify/backend/api/JibungotoPlanetGql/schema.graphql
  const estimations = []

  // ベースラインのフットプリントを取得
  const params = {
    TableName: footprintTableName,
    KeyConditions: {
      dir_domain: {
        ComparisonOperator: 'EQ',
        AttributeValueList: ['baseline_housing']
      }
    }
  }

  const data = await dynamodb.query(params).promise()
  const baselines = data.Items.map((item) => toBaseline(item))

  const findAmount = (item) =>
    findBaseline(baselines, 'housing', item, 'amount')
  const createAmount = (item) =>
    toEstimation(findBaseline(baselines, 'housing', item, 'amount'))
  const createIntensity = (item) =>
    toEstimation(findBaseline(baselines, 'housing', item, 'intensity'))

  // 回答がない場合はベースラインのみ返す
  if (!housingAnswer) {
    return { baselines, estimations }
  }
  const residentCount = housingAnswer.residentCount

  // 下記部分でパラメータ名から一致を取る必要があるため、ケバブのまま変数化
  const estimationAmount = {
    'land-rent': createAmount('land-rent'),
    'imputed-rent': createAmount('imputed-rent'),
    rent: createAmount('rent'),
    'housing-maintenance': createAmount('housing-maintenance'),
    electricity: createAmount('electricity'),
    'urban-gas': createAmount('urban-gas'),
    lpg: createAmount('lpg'),
    kerosene: createAmount('kerosene')
  }

  //
  // # お住まいの地域（地方）はどちらですか？
  //
  // 全体の補正値
  //
  // housingAmountByRegion: String # northeast|middle|southwest|unknown
  //
  if (housingAnswer.housingAmountByRegionFirstKey) {
    const housingAmountByRegion =
      housingAnswer.housingAmountByRegionFirstKey + '_'
    const params = {
      TableName: parameterTableName,
      KeyConditions: {
        category: {
          ComparisonOperator: 'EQ',
          AttributeValueList: ['housing-amount-by-region']
        },
        key: {
          ComparisonOperator: 'BEGINS_WITH',
          AttributeValueList: [housingAmountByRegion]
        }
      }
    }
    const amountByRegion = await dynamodb.query(params).promise()

    // estimationAmountに項目があるものだけ、amountByRegionの値を上書き
    for (const key of Object.keys(estimationAmount)) {
      const rec = amountByRegion.Items.find(
        (a) => a.key === housingAmountByRegion + key + '-amount'
      )
      if (rec) {
        estimationAmount[key].value = rec.value
      }
      estimations.push(estimationAmount[key])
    }
  }

  //
  // ここから個別補正
  //
  // ※ちなみに以下は個別の補正なし。
  // landRent
  // otherEnergy
  // water

  if (housingAnswer.housingSizeKey) {
    const housingSize = await getData(
      'housing-size',
      housingAnswer.housingSizeKey
    )
    const housingSizePerResident =
      housingAnswer.housingSizeKey === 'unknown'
        ? housingSize.Item?.value
        : housingSize.Item?.value / residentCount

    const imputedRentValue = findAmount('imputed-rent').value
    const rentValue = findAmount('rent').value

    estimationAmount['imputed-rent'].value =
      (housingSizePerResident / (imputedRentValue + rentValue)) *
      imputedRentValue

    estimationAmount.rent.value =
      (housingSizePerResident / (imputedRentValue + rentValue)) * rentValue

    estimationAmount['housing-maintenance'].value =
      (findAmount('housing-maintenance').value /
        (imputedRentValue + rentValue)) *
      (estimationAmount['imputed-rent'].value + estimationAmount.rent.value)
    pushOrUpdateEstimate(
      'imputed-rent',
      'amount',
      estimationAmount['imputed-rent']
    )
    pushOrUpdateEstimate('rent', 'amount', estimationAmount.rent)
    pushOrUpdateEstimate(
      'housing-maintenance',
      'amount',
      estimationAmount['housing-maintenance']
    )
  }

  // 再生可能エネルギー
  if (housingAnswer.electricityIntensityKey) {
    const electricityParam = await getData(
      'electricity-intensity',
      housingAnswer.electricityIntensityKey
    )
    const electricityIntensity = createIntensity('electricity')
    electricityIntensity.value = electricityParam.Item?.value
    estimations.push(electricityIntensity)
  }

  // 電力使用量
  if (
    housingAnswer.electricityMonthlyConsumption &&
    housingAnswer.electricitySeasonFactorKey
  ) {
    const electricitySeason = await getData(
      'electricity-season-factor',
      housingAnswer.electricitySeasonFactorKey
    )
    // =IF('2_CF推定質問'!F24='2_CF推定質問'!W25,'2_CF推定質問'!U90,'2_CF推定質問'!S38)
    console.log(
      'electricitySeason.Item?.value = ' + electricitySeason.Item?.value
    )
    // todo 電気時自動車分をどうやって取ってくるか
    estimationAmount.electricity.value =
      (housingAnswer.electricityMonthlyConsumption *
        electricitySeason.Item?.value) /
      residentCount
    pushOrUpdateEstimate('electricity', 'amount', estimationAmount.electricity)
  }

  // ガスの使用の有無
  if (housingAnswer.useGas) {
    let gasParam = null
    if (
      housingAnswer.gasMonthlyConsumption &&
      housingAnswer.gasSeasonFactorKey
    ) {
      const gasSeason = await getData(
        'gas-season-factor',
        housingAnswer.gasSeasonFactorKey
      )
      const gasFactor = await getData(
        'energy-heat-intensity',
        housingAnswer.energyHeatIntensityKey
      )

      gasParam =
        (housingAnswer.gasMonthlyConsumption *
          (gasSeason.Item?.value || 1) *
          (gasFactor.Item?.value || 1)) /
        residentCount
    }
    if (housingAnswer.energyHeatIntensityKey === 'lpg') {
      if (gasParam) {
        estimationAmount.lpg.value = gasParam
      }
      estimationAmount['urban-gas'].value = 0
    } else {
      if (gasParam) {
        estimationAmount['urban-gas'].value = gasParam
      }
      estimationAmount.lpg.value = 0
    }
    pushOrUpdateEstimate('urban-gas', 'amount', estimationAmount['urban-gas'])
    pushOrUpdateEstimate('lpg', 'amount', estimationAmount.lpg)
  } else if (housingAnswer.useGas === false) {
    estimationAmount['urban-gas'].value = 0
    estimationAmount.lpg.value = 0
    pushOrUpdateEstimate('urban-gas', 'amount', estimationAmount['urban-gas'])
    pushOrUpdateEstimate('lpg', 'amount', estimationAmount.lpg)
  }

  // 灯油の使用の有無
  if (housingAnswer.useKerosene) {
    if (
      housingAnswer.keroseneMonthlyConsumption &&
      housingAnswer.keroseneMonthCount
    ) {
      const keroseneData = await getData('energy-heat-intensity', 'kerosene')
      estimationAmount.kerosene.value =
        ((keroseneData?.Item?.value || 1) *
          (housingAnswer.keroseneMonthlyConsumption *
            housingAnswer.keroseneMonthCount)) /
        residentCount
    }
    pushOrUpdateEstimate('kerosene', 'amount', estimationAmount.kerosene)
  } else if (housingAnswer.useKerosene === false) {
    estimationAmount.kerosene.value = 0
    pushOrUpdateEstimate('kerosene', 'amount', estimationAmount.kerosene)
  }

  return { baselines, estimations }
}

export { estimateHousing }
