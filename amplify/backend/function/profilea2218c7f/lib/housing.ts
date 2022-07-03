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
      dirAndDomain: {
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

  const estimationAmount = {
    landRent: findAmount(baselines, 'land-rent'),
    otherEnergy: findAmount(baselines, 'other-energy'),
    water: findAmount(baselines, 'water'),
    imputedRent: findAmount(baselines, 'imputed-rent'),
    rent: findAmount(baselines, 'rent'),
    'housing-maintenance': findAmount(baselines, 'housing-maintenance'),
    electricity: findAmount(baselines, 'electricity'),
    urbanGas: findAmount(baselines, 'urban-gas'),
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
  if (housingAnswer.housingAmountByRegionKey) {
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
      estimationAmount[key].value = item.value
      // estimations.push(toEstimation(estimationAmount[key]))
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
    const housingSizeParams = {
      TableName: parameterTableName,
      KeyConditions: {
        category: {
          ComparisonOperator: 'EQ',
          AttributeValueList: ['housing-size']
        },
        key: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [housingAnswer.housingSizeKey]
        }
      }
    }
    const housingSize = await dynamodb.query(housingSizeParams).promise()
    const housingSizePerPeople = housingSize.Items[0]?.value / residentCount
    const imputedRentValue = estimationAmount.imputedRent.value
    const rentValue = estimationAmount.rent.value
    estimationAmount.imputedRent.value =
      (housingSizePerPeople / (imputedRentValue + rentValue)) * imputedRentValue
    estimationAmount.rent.value =
      (housingSizePerPeople / (imputedRentValue + rentValue)) * rentValue
    estimationAmount['housing-maintenance'].value =
      (estimationAmount['housing-maintenance'].value /
        (imputedRentValue + rentValue)) *
      (estimationAmount.imputedRent.value + estimationAmount.rent.value)
    estimations.push(toEstimation(estimationAmount.imputedRent))
    estimations.push(toEstimation(estimationAmount.rent))
    estimations.push(toEstimation(estimationAmount['housing-maintenance']))
    // pushOrUpdateEstimate('imputedRent', 'amount', toEstimation(estimationAmount.imputedRent))
    // pushOrUpdateEstimate('rent', 'amount', toEstimation(estimationAmount.rent))
    // pushOrUpdateEstimate('housing-maintenance', 'amount', toEstimation(estimationAmount['housing-maintenance']))
  }

  // 再生可能エネルギー
  if (housingAnswer.electricityIntensityKey) {
    const electricityIntensityParams = {
      TableName: parameterTableName,
      KeyConditions: {
        category: {
          ComparisonOperator: 'EQ',
          AttributeValueList: ['electricity-intensity']
        },
        key: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [housingAnswer.electricityIntensityKey]
        }
      }
    }
    const electricityParam = await dynamodb
      .query(electricityIntensityParams)
      .promise()
    const electricityIntensity = findIntensity(baselines, 'electricity')
    electricityIntensity.value = electricityParam.Items[0]?.value
    estimations.push(toEstimation(electricityIntensity))
  }

  // 電力使用量
  if (
    housingAnswer.electricityMonthlyConsumption &&
    housingAnswer.electricitySeasonFactorKey
  ) {
    const electricitySeasonParams = {
      TableName: parameterTableName,
      KeyConditions: {
        category: {
          ComparisonOperator: 'EQ',
          AttributeValueList: ['electricity-season-factor']
        },
        key: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [housingAnswer.electricitySeasonFactorKey]
        }
      }
    }
    const electricitySeason = await dynamodb
      .query(electricitySeasonParams)
      .promise()
    // todo 電気時自動車分をどうやって取ってくるか
    estimationAmount.electricity.value =
      (housingAnswer.electricityMonthlyConsumption *
        electricitySeason.Items[0]?.value) /
      residentCount
    estimations.push(toEstimation(estimationAmount.electricity))
    // pushOrUpdateEstimate('electricity', 'amount', toEstimation(estimationAmount.electricity))
  }

  // ガスの使用の有無
  if (housingAnswer.useGas) {
    let gasParam = null
    if (
      housingAnswer.gasMonthlyConsumption &&
      housingAnswer.gasSeasonFactorKey
    ) {
      const gasSeasonParams = {
        TableName: parameterTableName,
        KeyConditions: {
          category: {
            ComparisonOperator: 'EQ',
            AttributeValueList: ['gas-season-factor']
          },
          key: {
            ComparisonOperator: 'EQ',
            AttributeValueList: [housingAnswer.gasSeasonFactorKey]
          }
        }
      }
      const gasSeason = await dynamodb.query(gasSeasonParams).promise()
      gasParam =
        (housingAnswer.gasMonthlyConsumption * gasSeason.Items[0]?.value) /
        residentCount
    }
    if (housingAnswer.energyHeatIntensityKey === 'lpg') {
      if (gasParam) {
        estimationAmount.lpg.value = gasParam
      }
      estimationAmount.urbanGas.value = 0
    } else {
      if (gasParam) {
        estimationAmount.urbanGas.value = gasParam
      }
      estimationAmount.lpg.value = 0
    }
    estimations.push(toEstimation(estimationAmount.urbanGas))
    estimations.push(toEstimation(estimationAmount.lpg))
  } else if (housingAnswer.useGas === false) {
    estimationAmount.urbanGas.value = 0
    estimationAmount.lpg.value = 0
    estimations.push(toEstimation(estimationAmount.urbanGas))
    estimations.push(toEstimation(estimationAmount.lpg))
    // pushOrUpdateEstimate('urbanGas', 'amount', toEstimation(estimationAmount.urbanGas))
    // pushOrUpdateEstimate('lpg', 'amount', toEstimation(estimationAmount.lpg))
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
    estimations.push(toEstimation(estimationAmount.kerosene))
    // pushOrUpdateEstimate('kerosene', 'amount', toEstimation(estimationAmount.kerosene))
  } else if (housingAnswer.useKerosene === false) {
    estimationAmount.kerosene.value = 0
    estimations.push(toEstimation(estimationAmount.kerosene))
    // pushOrUpdateEstimate('kerosene', 'amount', toEstimation(estimationAmount.kerosene))
  }

  console.log(JSON.stringify(estimations))
  return { baselines, estimations }
}

export { estimateHousing }
