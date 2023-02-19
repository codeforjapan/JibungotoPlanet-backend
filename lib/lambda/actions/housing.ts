import { toBaseline, findBaseline, toEstimation } from './util'

const estimateHousing = async (
  dynamodb: any,
  housingAnswer: any,
  mobilityAnswer: any,
  footprintTableName: any,
  parameterTableName: any
) => {
  const getData = async (category: any, key: any) =>
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
  const pushOrUpdateEstimate = (item: any, type: any, estimation: any) => {
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

  const estimations: { domain: any; item: any; type: any; value: any; subdomain: any; unit: any }[] = []

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
  const baselines = data.Items.map((item: any) => toBaseline(item))

  const findAmount = (item: string) =>
    findBaseline(baselines, 'housing', item, 'amount')
  const createAmount = (item: string) =>
    toEstimation(findBaseline(baselines, 'housing', item, 'amount'))
  const createIntensity = (item: string) =>
    toEstimation(findBaseline(baselines, 'housing', item, 'intensity'))

  // 回答がない場合はベースラインのみ返す
  if (!housingAnswer) {
    return { baselines, estimations }
  }
  const residentCount = housingAnswer.residentCount
  // 住居人数が0以下の場合はベースラインのみ返す
  if (residentCount <= 0) {
    return { baselines, estimations }
  }

  // 下記部分でパラメータ名から一致を取る必要があるため、ケバブのまま変数化
  const estimationAmount = {
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
        (a: { key: string }) => a.key === housingAmountByRegion + key + '-amount'
      )
      if (rec) {
        // @ts-ignore
        estimationAmount[key].value = rec.value
      }
      // @ts-ignore
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
    housingAnswer.electricityMonthlyConsumption != undefined &&
    housingAnswer.electricityMonthlyConsumption != null &&
    housingAnswer.electricitySeasonFactorKey
  ) {
    const electricitySeason = await getData(
      'electricity-season-factor',
      housingAnswer.electricitySeasonFactorKey
    )

    let mobilityElectricityAmount = 0
    // PHV, EVの補正
    if (
      mobilityAnswer?.hasPrivateCar &&
      (mobilityAnswer?.carIntensityFactorFirstKey === 'phv' ||
        mobilityAnswer?.carIntensityFactorFirstKey === 'ev') &&
      mobilityAnswer?.privateCarAnnualMileage &&
      mobilityAnswer?.carChargingKey
    ) {
      const electricityData = await getData(
        'car-intensity-factor',
        mobilityAnswer.carIntensityFactorFirstKey + '_electricity-intensity'
      )
      const mobilityElectricity = electricityData?.Item?.value || 1

      const chargingData = await getData(
        'car-charging',
        mobilityAnswer.carChargingKey
      )

      const mobilityCharging = chargingData?.Item?.value || 1
      mobilityElectricityAmount =
        mobilityAnswer.privateCarAnnualMileage *
        mobilityElectricity *
        mobilityCharging
    }

    estimationAmount.electricity.value =
      (housingAnswer.electricityMonthlyConsumption *
        electricitySeason.Item?.value) /
      residentCount -
      mobilityElectricityAmount
    pushOrUpdateEstimate('electricity', 'amount', estimationAmount.electricity)
  }

  // ガスの使用の有無
  if (housingAnswer.useGas) {
    let gasParam = null
    if (
      housingAnswer.gasMonthlyConsumption != undefined &&
      housingAnswer.gasMonthlyConsumption != null &&
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
      if (gasParam != null) {
        estimationAmount.lpg.value = gasParam
      }
      estimationAmount['urban-gas'].value = 0
    } else if (housingAnswer.energyHeatIntensityKey === 'urban-gas') {
      if (gasParam != null) {
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
      housingAnswer.keroseneMonthlyConsumption != undefined &&
      housingAnswer.keroseneMonthlyConsumption != null &&
      housingAnswer.keroseneMonthCount != undefined &&
      housingAnswer.keroseneMonthCount != null
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
