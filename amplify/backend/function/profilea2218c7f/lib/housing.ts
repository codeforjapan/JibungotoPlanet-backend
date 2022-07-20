import { toBaseline, findBaseline, toEstimation } from './util'

const estimateHousing = async (
  dynamodb,
  housingAnswer,
  footprintTableName,
  parameterTableName
) => {
  const findAmount = (baselines, item) =>
    findBaseline(baselines, 'housing', item, 'amount')
  const findIntensity = (baselines, item) =>
    findBaseline(baselines, 'housing', item, 'intensity')

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

  // 回答がない場合はベースラインのみ返す
  if (!housingAnswer) {
    return { baselines, estimations }
  }
  const residentCount = housingAnswer.residentCount

  // 下記部分でパラメータ名から一致を取る必要があるため、ケバブのまま変数化
  const estimationAmount = {
    'land-rent': findAmount(baselines, 'land-rent'),
    'other-energy': findAmount(baselines, 'other-energy'),
    water: findAmount(baselines, 'water'),
    'imputed-rent': findAmount(baselines, 'imputed-rent'),
    rent: findAmount(baselines, 'rent'),
    'housing-maintenance': findAmount(baselines, 'housing-maintenance'),
    electricity: findAmount(baselines, 'electricity'),
    'urban-gas': findAmount(baselines, 'urban-gas'),
    lpg: findAmount(baselines, 'lpg'),
    kerosene: findAmount(baselines, 'kerosene')
  }

  //
  // # お住まいの地域（地方）はどちらですか？
  //
  // 全体の補正値
  //
  // housingAmountByRegion: String # northeast|middle|southwest|unknown
  //
  if (housingAnswer.housingAmountByRegionFirstKey) {
    const housingAmountByRegion = housingAnswer.housingAmountByRegionFirstKey
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
    const re = new RegExp(`${housingAmountByRegion}_(.*)-amount`)

    amountByRegion.Items.forEach((item) => {
      const key = item.key.match(re)[1]
      estimations.push(toEstimation(estimationAmount[key]))
    })
  }

  //
  // ここから個別補正
  //
  // ※ちなみに以下は個別の補正なし。
  // landRent
  // otherEnergy
  // water

  if (housingAnswer.housingSizeKey) {
    const housingSize = await dynamodb
      .get({
        TableName: parameterTableName,
        Key: {
          category: 'housing-size',
          key: housingAnswer.housingSizeKey
        }
      })
      .promise()
    const housingSizePerPeople = housingSize.Item?.value / residentCount
    const imputedRentValue = estimationAmount['imputed-rent'].value
    const rentValue = estimationAmount.rent.value
    estimationAmount['imputed-rent'].value =
      (housingSizePerPeople / (imputedRentValue + rentValue)) * imputedRentValue
    estimationAmount.rent.value =
      (housingSizePerPeople / (imputedRentValue + rentValue)) * rentValue
    estimationAmount['housing-maintenance'].value =
      (estimationAmount['housing-maintenance'].value /
        (imputedRentValue + rentValue)) *
      (estimationAmount['imputed-rent'].value + estimationAmount.rent.value)
    pushOrUpdateEstimate(
      'imputed-rent',
      'amount',
      toEstimation(estimationAmount['imputed-rent'])
    )
    pushOrUpdateEstimate('rent', 'amount', toEstimation(estimationAmount.rent))
    pushOrUpdateEstimate(
      'housing-maintenance',
      'amount',
      toEstimation(estimationAmount['housing-maintenance'])
    )
  }

  // 再生可能エネルギー
  if (housingAnswer.electricityIntensityKey) {
    const electricityParam = await dynamodb
      .get({
        TableName: parameterTableName,
        Key: {
          category: 'electricity-intensity',
          key: housingAnswer.electricityIntensityKey
        }
      })
      .promise()
    const electricityIntensity = findIntensity(baselines, 'electricity')
    electricityIntensity.value = electricityParam.Item?.value
    estimations.push(toEstimation(electricityIntensity))
  }

  // 電力使用量
  if (
    housingAnswer.electricityMonthlyConsumption &&
    housingAnswer.electricitySeasonFactorKey
  ) {
    const electricitySeason = await dynamodb
      .get({
        TableName: parameterTableName,
        Key: {
          category: 'electricity-season-factor',
          key: housingAnswer.electricitySeasonFactorKey
        }
      })
      .promise()
    // todo 電気時自動車分をどうやって取ってくるか
    estimationAmount.electricity.value =
      (housingAnswer.electricityMonthlyConsumption *
        electricitySeason.Item?.value) /
      residentCount
    pushOrUpdateEstimate(
      'electricity',
      'amount',
      toEstimation(estimationAmount.electricity)
    )
  }

  // ガスの使用の有無
  if (housingAnswer.useGas) {
    let gasParam = null
    if (
      housingAnswer.gasMonthlyConsumption &&
      housingAnswer.gasSeasonFactorKey
    ) {
      const gasSeason = await dynamodb
        .get({
          TableName: parameterTableName,
          Key: {
            category: 'gas-season-factor',
            key: housingAnswer.gasSeasonFactorKey
          }
        })
        .promise()
      gasParam =
        (housingAnswer.gasMonthlyConsumption * gasSeason.Item?.value) /
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
    pushOrUpdateEstimate(
      'urban-gas',
      'amount',
      toEstimation(estimationAmount['urban-gas'])
    )
    pushOrUpdateEstimate('lpg', 'amount', toEstimation(estimationAmount.lpg))
  } else if (housingAnswer.useGas === false) {
    estimationAmount['urban-gas'].value = 0
    estimationAmount.lpg.value = 0
    pushOrUpdateEstimate(
      'urban-gas',
      'amount',
      toEstimation(estimationAmount['urban-gas'])
    )
    pushOrUpdateEstimate('lpg', 'amount', toEstimation(estimationAmount.lpg))
  }

  // 灯油の使用の有無
  if (housingAnswer.useKerosene) {
    if (
      housingAnswer.keroseneMonthlyConsumption &&
      housingAnswer.keroseneMonthCount
    ) {
      estimationAmount.kerosene.value =
        (housingAnswer.keroseneMonthlyConsumption *
          housingAnswer.keroseneMonthCount) /
        residentCount
    }
    pushOrUpdateEstimate(
      'kerosene',
      'amount',
      toEstimation(estimationAmount.kerosene)
    )
  } else if (housingAnswer.useKerosene === false) {
    estimationAmount.kerosene.value = 0
    pushOrUpdateEstimate(
      'kerosene',
      'amount',
      toEstimation(estimationAmount.kerosene)
    )
  }

  // console.log(JSON.stringify(estimations))
  return { baselines, estimations }
}

export { estimateHousing }
