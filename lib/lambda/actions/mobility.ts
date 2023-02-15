import { toBaseline, findBaseline, toEstimation } from './util'

const estimateMobility = async (
  dynamodb: { get: (arg0: { TableName: any; Key: { category: any; key: any } }) => { (): any; new(): any; promise: { (): any; new(): any } }; query: (arg0: { TableName: any; KeyConditions: { dir_domain: { ComparisonOperator: string; AttributeValueList: string[] } } | { category: { ComparisonOperator: string; AttributeValueList: string[] } } | { category: { ComparisonOperator: string; AttributeValueList: string[] }; key: { ComparisonOperator: string; AttributeValueList: string[] } } }) => { (): any; new(): any; promise: { (): any; new(): any } } },
  housingAnswer: { electricityIntensityKey: any },
  mobilityAnswer: { carChargingKey: any; hasPrivateCar: any; carIntensityFactorFirstKey: string; carPassengersFirstKey: string; privateCarAnnualMileage: number; hasTravelingTime: any; trainWeeklyTravelingTime: any; busWeeklyTravelingTime: any; motorbikeWeeklyTravelingTime: any; otherCarWeeklyTravelingTime: any; otherCarAnnualTravelingTime: any; trainAnnualTravelingTime: any; busAnnualTravelingTime: any; motorbikeAnnualTravelingTime: any; airplaneAnnualTravelingTime: any; ferryAnnualTravelingTime: any; mileageByAreaFirstKey: string },
  footprintTableName: any,
  parameterTableName: any
) => {
  // mobilityのベースラインの取得
  const createAmount = (baselines: any, item: string) =>
    toEstimation(findBaseline(baselines, 'mobility', item, 'amount'))
  const createIntensity = (baselines: any, item: string) =>
    toEstimation(findBaseline(baselines, 'mobility', item, 'intensity'))

  const getData = async (category: string, key: string) =>
    await dynamodb
      .get({
        TableName: parameterTableName,
        Key: {
          category: category,
          key: key
        }
      })
      .promise()

  const estimations: { domain: any; item: any; type: any; value: any; subdomain: any; unit: any; }[] = []

  const pushOrUpdateEstimate = (item: any, type: any, estimation: { domain?: any; item?: any; type?: any; value: any; subdomain?: any; unit?: any; }) => {
    const estimate = estimations.find(
      (estimation) => estimation.item === item && estimation.type === type
    )
    if (estimate) {
      estimate.value = estimation.value
    } else {
      // @ts-ignore
      estimations.push(estimation)
    }
  }

  // ベースラインのフットプリントを取得
  let params = {
    TableName: footprintTableName,
    KeyConditions: {
      dir_domain: {
        ComparisonOperator: 'EQ',
        AttributeValueList: ['baseline_mobility']
      }
    }
  }

  let data = await dynamodb.query(params).promise()
  const baselines = data.Items.map((item: any) => toBaseline(item))

  // 回答がない場合はベースラインのみ返す
  if (!mobilityAnswer) {
    return { baselines, estimations }
  }

  let electricityIntensityFactor = 0

  // PHV, EVの場合は自宅での充電割合と再生エネルギー電力の割合で補正
  if (housingAnswer?.electricityIntensityKey) {
    const electricityData = await getData(
      'electricity-intensity-factor',
      housingAnswer.electricityIntensityKey
    )
    if (electricityData?.Item) {
      electricityIntensityFactor = electricityData.Item.value
    }

    const carChargingData = await getData(
      'car-charging',
      mobilityAnswer?.carChargingKey || 'unknown'
    )
    if (carChargingData?.Item) {
      electricityIntensityFactor *= carChargingData.Item.value
    }
  }

  //
  // 答えに従ってestimationを計算
  //

  // 自家用車をお持ちですか？がYesの場合
  if (mobilityAnswer.hasPrivateCar) {
    if (mobilityAnswer?.carIntensityFactorFirstKey) {
      const drivingIntensity = createIntensity(baselines, 'private-car-driving')

      // 自家用車の場合は、自動車種類に応じて運転時GHG原単位を取得
      let ghgIntensityRatio = 1
      let data = await getData(
        'car-intensity-factor',
        mobilityAnswer.carIntensityFactorFirstKey + '_driving-factor'
      )
      if (data?.Item) {
        ghgIntensityRatio *= data.Item.value
      }

      // PHV, EVの補正
      if (
        mobilityAnswer.carIntensityFactorFirstKey === 'phv' ||
        mobilityAnswer.carIntensityFactorFirstKey === 'ev'
      ) {
        const data = await getData(
          'renewable-car-intensity-factor',
          mobilityAnswer.carIntensityFactorFirstKey + '_driving-factor'
        )
        if (data?.Item) {
          ghgIntensityRatio =
            ghgIntensityRatio * (1 - electricityIntensityFactor) +
            data.Item.value * electricityIntensityFactor
        }
      }

      // 人数補正値
      data = await getData(
        'car-passengers',
        (mobilityAnswer.carPassengersFirstKey || 'unknown') +
          '_private-car-factor'
      )
      let passengerIntensityRatio = data?.Item?.value || 1

      const purchaseIntensity = createIntensity(
        baselines,
        'private-car-purchase'
      )

      // 自家用車の場合は、自動車種類に応じて運転時GHG原単位を取得
      const purchaseData = await getData(
        'car-intensity-factor',
        (mobilityAnswer.carIntensityFactorFirstKey || 'unknown') +
          '_manufacturing-factor'
      )
      if (purchaseData?.Item) {
        purchaseIntensity.value *= purchaseData.Item.value
      }
      estimations.push(purchaseIntensity)

      drivingIntensity.value *= ghgIntensityRatio * passengerIntensityRatio
      estimations.push(drivingIntensity)

      // 自家用車の移動距離を取得
      const amount = createAmount(baselines, 'private-car-driving')
      const baselineAmount = amount.value
      amount.value = mobilityAnswer.privateCarAnnualMileage || 0
      estimations.push(amount)
      const mileageRatio = amount.value / baselineAmount

      const privateCarPurchase = createAmount(baselines, 'private-car-purchase')
      const privateCarMaintenance = createAmount(
        baselines,
        'private-car-maintenance'
      )

      // 自家用車の購入・メンテナンスを移動距離比で補正
      privateCarPurchase.value *= mileageRatio
      privateCarMaintenance.value *= mileageRatio
      estimations.push(privateCarPurchase)
      estimations.push(privateCarMaintenance)
    }
  } else {
    const amount = createAmount(baselines, 'private-car-driving')
    amount.value = 0
    estimations.push(amount)
    const privateCarPurchase = createAmount(baselines, 'private-car-purchase')
    privateCarPurchase.value = 0
    estimations.push(privateCarPurchase)
    const privateCarMaintenance = createAmount(
      baselines,
      'private-car-maintenance'
    )
    privateCarMaintenance.value = 0
    estimations.push(privateCarMaintenance)
  }

  // taxiのintensity補正。本来はtaxiの乗車人数を確認する必要があるがcarPassengersFirstKeyを代用
  if (mobilityAnswer.carPassengersFirstKey) {
    const intensity = createIntensity(baselines, 'taxi')
    // 人数補正値
    const data = await getData(
      'car-passengers',
      mobilityAnswer.carPassengersFirstKey + '_taxi-factor'
    )
    const ratio = data?.Item?.value || 1
    intensity.value *= ratio
    estimations.push(intensity)
  }

  // カーシェアの補正。本来はcar-sharingの乗車人数を確認する必要があるがcarPassengersFirstKeyを代用
  if (
    mobilityAnswer.carPassengersFirstKey &&
    mobilityAnswer.carIntensityFactorFirstKey
  ) {
    // car-sharing-drivingのintensity補正
    // 人数補正値
    const passengers = await getData(
      'car-passengers',
      mobilityAnswer.carPassengersFirstKey + '_private-car-factor'
    )
    const passengerIntensityRatio = passengers?.Item?.value || 1

    const driving = await getData(
      'car-intensity-factor',
      (mobilityAnswer.carIntensityFactorFirstKey || 'unknown') +
        '_driving-factor'
    )
    let ghgIntensityRatio = driving?.Item?.value || 1
    // PHV, EVの補正
    if (
      mobilityAnswer?.carIntensityFactorFirstKey === 'phv' ||
      mobilityAnswer?.carIntensityFactorFirstKey === 'ev'
    ) {
      const data = await getData(
        'renewable-car-intensity-factor',
        mobilityAnswer.carIntensityFactorFirstKey + '_driving-factor'
      )
      if (data?.Item) {
        ghgIntensityRatio =
          ghgIntensityRatio * (1 - electricityIntensityFactor) +
          data.Item.value * electricityIntensityFactor
      }
    }

    const intensity = createIntensity(baselines, 'car-sharing-driving')
    intensity.value *= ghgIntensityRatio * passengerIntensityRatio
    estimations.push(intensity)

    // car-sharing-rentalのintensity補正
    const rental = await getData(
      'car-intensity-factor',
      (mobilityAnswer.carIntensityFactorFirstKey || 'unknown') +
        '_manufacturing-factor'
    )
    if (rental?.Item) {
      const intensity = createIntensity(baselines, 'car-sharing-rental')
      intensity.value *= rental.Item.value
      estimations.push(intensity)
    }
  }

  // <baselineを使用>
  // bicycle-driving
  // bicycle-maintenance
  // walking

  // mobilityのベースラインの取得
  const estimationAmount = {
    airplane: createAmount(baselines, 'airplane'),
    train: createAmount(baselines, 'train'),
    bus: createAmount(baselines, 'bus'),
    ferry: createAmount(baselines, 'ferry'),
    taxi: createAmount(baselines, 'taxi'),
    carSharing: createAmount(baselines, 'car-sharing-driving'),
    motorbike: createAmount(baselines, 'motorbike-driving'),
    motorbikePurchase: createAmount(baselines, 'motorbike-purchase'),
    carSharingRental: createAmount(baselines, 'car-sharing-rental'),
    motorbikeMaintenance: createAmount(baselines, 'motorbike-maintenance')
  }

  const mileage = {
    airplane: 0,
    train: 0,
    bus: 0,
    ferry: 0,
    taxi: 0,
    carSharing: 0,
    motorbike: 0
  }

  //=IF('2_CF推定質問'!$F$169='2_CF推定質問'!$W$169,'2_CF推定質問'!U204,Y83/Y78*AW78)
  //
  // 自家用車以外の普通の移動手段を教えて下さい
  //
  if (mobilityAnswer.hasTravelingTime) {
    // 自家用車以外の移動手段（weekly）
    const weeklyTravelingTime = {
      train: mobilityAnswer.trainWeeklyTravelingTime || 0,
      bus: mobilityAnswer.busWeeklyTravelingTime || 0,
      motorbike: mobilityAnswer.motorbikeWeeklyTravelingTime || 0,
      otherCar: mobilityAnswer.otherCarWeeklyTravelingTime || 0
    }

    //
    // 昨年１年間で、旅行などで利用した移動手段を教えてください
    //
    const annualTravelingTime = {
      otherCar: mobilityAnswer.otherCarAnnualTravelingTime || 0,
      train: mobilityAnswer.trainAnnualTravelingTime || 0,
      bus: mobilityAnswer.busAnnualTravelingTime || 0,
      motorbike: mobilityAnswer.motorbikeAnnualTravelingTime || 0,
      airplane: mobilityAnswer.airplaneAnnualTravelingTime || 0,
      ferry: mobilityAnswer.ferryAnnualTravelingTime || 0
    }

    // 年間週数の取得
    data = await getData('misc', 'weeks-per-year-excluding-long-vacations')
    let weekCount = 49
    if (data?.Item) {
      weekCount = data.Item.value
    }

    // 時速の取得
    const paramsTransportation = {
      TableName: parameterTableName,
      KeyConditions: {
        category: {
          ComparisonOperator: 'EQ',
          AttributeValueList: ['transportation-speed']
        }
      }
    }
    data = await dynamodb.query(paramsTransportation).promise()
    const speed = data.Items.reduce((a: { [x: string]: any; }, x: { key: string | number; value: any; }) => {
      a[x.key] = x.value
      return a
    }, {})

    // 飛行機の移動距離の積算
    mileage.airplane += annualTravelingTime.airplane * speed['airplane-speed']
    // フェリーの移動距離の積算
    mileage.ferry += annualTravelingTime.ferry * speed['ferry-speed']

    // 電車の移動距離の積算
    mileage.train +=
      weeklyTravelingTime.train * weekCount * speed['train-speed'] +
      annualTravelingTime.train * speed['long-distance-train-speed']

    // バスの移動距離の積算
    mileage.bus +=
      weeklyTravelingTime.bus * weekCount * speed['bus-speed'] +
      annualTravelingTime.bus * speed['express-bus-speed']

    // バイクの移動距離の積算
    mileage.motorbike +=
      weeklyTravelingTime.motorbike * weekCount * speed['motorbike-speed'] +
      annualTravelingTime.motorbike * speed['long-distance-motorbike-speed']

    const taxiRatio =
      estimationAmount.taxi.value /
      (estimationAmount.taxi.value + estimationAmount.carSharing.value)

    // タクシー他、その他の移動の算出
    const otherCarMileage =
      weeklyTravelingTime.otherCar * weekCount * speed['car-speed'] +
      annualTravelingTime.otherCar * speed['long-distance-car-speed']

    mileage.taxi += otherCarMileage * taxiRatio // タクシーの移動距離の積算
    mileage.carSharing += otherCarMileage * (1 - taxiRatio) // カーシェアリングの移動距離の積算

    // motorbike, carSharingベースライン値のバックアップ
    const baselineMotorbikeAmount = estimationAmount.motorbike.value
    const baselineCarSharingAmount = estimationAmount.carSharing.value

    // ベースラインの値を書き換えてEstimationを生成
    for (let item of Object.keys(mileage)) {
      // @ts-ignore
      estimationAmount[item].value = mileage[item]
      // @ts-ignore
      estimations.push(estimationAmount[item])
    }

    // バイクの購入・メンテナンス、カーシェアの回数はベースラインとの比率で変更
    const motorbikeDrivingRatio =
      estimationAmount.motorbike.value / baselineMotorbikeAmount
    const carSharingDrivingRatio =
      estimationAmount.carSharing.value / baselineCarSharingAmount

    estimationAmount.motorbikePurchase.value *= motorbikeDrivingRatio
    estimationAmount.carSharingRental.value *= carSharingDrivingRatio
    estimationAmount.motorbikeMaintenance.value *= motorbikeDrivingRatio

    estimations.push(estimationAmount.motorbikePurchase)
    estimations.push(estimationAmount.carSharingRental)
    estimations.push(estimationAmount.motorbikeMaintenance)
  } else {
    //
    // お住まいの地域の規模はどのくらいですか？
    //
    const mileageByAreaFirstKey =
      mobilityAnswer.mileageByAreaFirstKey || 'unknown'
    const params = {
      TableName: parameterTableName,
      KeyConditions: {
        category: {
          ComparisonOperator: 'EQ',
          AttributeValueList: ['mileage-by-area']
        },
        key: {
          ComparisonOperator: 'BEGINS_WITH',
          AttributeValueList: [mileageByAreaFirstKey + '_']
        }
      }
    }
    const data = await dynamodb.query(params).promise()
    const consumptionByArea = data.Items.reduce((a: { [x: string]: any; }, x: { key: string | number; value: any; }) => {
      a[x.key] = x.value
      return a
    }, {})

    estimationAmount.airplane.value =
      consumptionByArea[mileageByAreaFirstKey + '_airplane']
    estimationAmount.train.value =
      consumptionByArea[mileageByAreaFirstKey + '_train']
    estimationAmount.bus.value =
      consumptionByArea[mileageByAreaFirstKey + '_bus']
    estimationAmount.motorbike.value =
      consumptionByArea[mileageByAreaFirstKey + '_motorbike-driving']
    estimationAmount.taxi.value =
      consumptionByArea[mileageByAreaFirstKey + '_taxi']
    estimationAmount.carSharing.value =
      consumptionByArea[mileageByAreaFirstKey + '_car-sharing-driving']
    estimationAmount.ferry.value =
      consumptionByArea[mileageByAreaFirstKey + '_ferry']
    estimationAmount.motorbikePurchase.value =
      consumptionByArea[mileageByAreaFirstKey + '_motorbike-purchase']
    estimationAmount.carSharingRental.value =
      consumptionByArea[mileageByAreaFirstKey + '_car-sharing-rental']
    estimationAmount.motorbikeMaintenance.value =
      consumptionByArea[mileageByAreaFirstKey + '_motorbike-maintenance']

    const additionalAmount = {
      bicycleDriving: createAmount(baselines, 'bicycle-driving'),
      walking: createAmount(baselines, 'walking'),
      bicycleMaintenance: createAmount(baselines, 'bicycle-maintenance')
    }

    additionalAmount.walking.value =
      consumptionByArea[mileageByAreaFirstKey + '_walking']
    additionalAmount.bicycleDriving.value =
      consumptionByArea[mileageByAreaFirstKey + '_bicycle-driving']
    additionalAmount.bicycleMaintenance.value =
      consumptionByArea[mileageByAreaFirstKey + '_bicycle-maintenance']

    // ベースラインの値を書き換えてEstimationを生成
    for (let amount of Object.values(estimationAmount)) {
      pushOrUpdateEstimate(amount.item, amount.type, amount)
    }
    for (let amount of Object.values(additionalAmount)) {
      pushOrUpdateEstimate(amount.item, amount.type, amount)
    }
  }

  return { baselines, estimations }
}

export { estimateMobility }
