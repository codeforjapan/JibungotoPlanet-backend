const { toComponent, findComponent, toEstimation } = require('./util')

module.exports.estimateMobility = async (
  dynamodb,
  mobilityAnswer,
  footprintTableName,
  parameterTableName
) => {
  // mobilityのベースラインの取得
  const findAmount = (baselines, item) =>
    findComponent(baselines, 'mobility', item, 'amount')
  const findIntensity = (baselines, item) =>
    findComponent(baselines, 'mobility', item, 'intensity')

  // mobilityAnswerのスキーマと取りうる値は以下を参照。
  // amplify/backend/api/JibungotoPlanetGql/schema.graphql
  let estimations = []

  // ベースラインのフットプリントを取得
  let params = {
    TableName: footprintTableName,
    KeyConditions: {
      dirAndDomain: {
        ComparisonOperator: 'EQ',
        AttributeValueList: ['baseline_mobility']
      }
    }
  }

  let data = await dynamodb.query(params).promise()
  const baselines = data.Items.map((item) => toComponent(item))

  // 回答がない場合はベースラインのみ返す
  if (!mobilityAnswer) {
    return { baselines, estimations }
  }

  //
  // 答えに従ってestimationを計算
  //

  // 自家用車をお持ちですか？がYesの場合
  if (mobilityAnswer.hasPrivateCar) {
    if (mobilityAnswer.privateCarType) {
      const intensity = findIntensity(baselines, 'private-car-driving')

      // 自家用車の場合は、自動車種類に応じて運転時GHG原単位を取得
      const params = {
        TableName: parameterTableName,
        Key: {
          category: 'car-intensity-factor',
          key: mobilityAnswer.privateCarType + '_driving-factor'
        }
      }
      let data = await dynamodb.get(params).promise()
      if (data?.Item) {
        intensity.value = data.Item.value
      }

      // 人数補正値
      const carPassengers = mobilityAnswer.carPassengers || 'unknown'
      params.Key = {
        category: 'car-passengers',
        key: carPassengers + '_private-car-factor'
      }
      data = await dynamodb.get(params).promise()
      const ratio = data?.Item?.value || 1

      console.log('private-car-driving-intensity = ' + intensity.value)
      console.log(
        'carPassengers = ' + carPassengers + ', private-car-factor = ' + ratio
      )

      //
      // TODO: PHV, EVの場合は自宅での充電割合と再生エネルギー電力の割合で補正が必要。
      //
      intensity.value = intensity.value * ratio

      console.log(
        'private-car-driving-intensity after car passenger adjustment  = ' +
          intensity.value
      )

      estimations.push(toEstimation(intensity))

      // 自家用車の移動距離を取得
      const amount = findAmount(baselines, 'private-car-driving')
      const baselineAmount = amount.value
      amount.value = mobilityAnswer.privateCarAnnualMileage
      estimations.push(toEstimation(amount))
      const mileageRatio = amount.value / baselineAmount

      const privateCarPurchase = findAmount(baselines, 'private-car-purchase')
      const privateCarMaintenance = findAmount(
        baselines,
        'private-car-maintenance'
      )

      // 自家用車の購入・メンテナンスを移動距離比で補正
      privateCarPurchase.value *= mileageRatio
      privateCarMaintenance.value *= mileageRatio
      estimations.push(toEstimation(privateCarPurchase))
      estimations.push(toEstimation(privateCarMaintenance))
    }
  }

  console.log('calculating weekly mileage')

  // <baselineを使用>
  // bicycle-driving
  // bicycle-maintenance
  // walking

  // mobilityのベースラインの取得
  const airplane = findAmount(baselines, 'airplane')
  const train = findAmount(baselines, 'train')
  const bus = findAmount(baselines, 'bus')
  const ferry = findAmount(baselines, 'ferry')
  const taxi = findAmount(baselines, 'taxi')
  const carSharingDriving = findAmount(baselines, 'car-sharing-driving')
  const motorbikeDriving = findAmount(baselines, 'motorbike-driving')
  const motorbikePurchase = findAmount(baselines, 'motorbike-purchase')
  const carSharingRental = findAmount(baselines, 'car-sharing-rental')
  const motorbikeMaintenance = findAmount(baselines, 'motorbike-maintenance')

  // 自家用車以外の移動手段（weekly）
  let trainTravelingTime = 0
  let busTravelingTime = 0
  let motorbikeTravelingTime = 0
  let otherCarTravelingTime = 0

  let airplaneMileage = 0
  let ferryMileage = 0
  let trainMileage = 0
  let busMileage = 0
  let motorbikeMileage = 0
  let taxiMileage = 0
  let carSharingMileage = 0

  //
  // 自家用車以外の普通の移動手段を教えて下さい
  //
  if (!mobilityAnswer.weeklyDetailedMobilityUnknown) {
    trainTravelingTime = mobilityAnswer.trainWeeklyTravelingTime || 0
    busTravelingTime = mobilityAnswer.busWeeklyTravelingTime || 0
    motorbikeTravelingTime = mobilityAnswer.motorbikeWeeklyTravelingTime || 0
    otherCarTravelingTime = mobilityAnswer.otherCarWeeklyTravelingTime || 0
  } else {
    //
    // お住まいの地域の規模はどのくらいですか？
    //
    const params = {
      TableName: parameterTableName,
      KeyConditions: {
        category: {
          ComparisonOperator: 'EQ',
          AttributeValueList: ['mileage-by-area']
        },
        key: {
          ComparisonOperator: 'BEGINS_WITH',
          AttributeValueList: [livingAreaSize + '_']
        }
      }
    }
    const data = await dynamodb.query(params).promise()
    const milageByArea = data.Items.reduce((a, x) => {
      a[x.key] = x.value
      return a
    }, {})

    trainMileage = milageByArea[livingAreaSize + '_train']
    busMileage = milageByArea[livingAreaSize + '_bus']
    motorbikeMileage = milageByArea[livingAreaSize + '_motorbike']
    taxiMileage = milageByArea[livingAreaSize + '_taxi']
    carSharingMileage = milageByArea[livingAreaSize + 'car-sharing']
  }

  console.log('calculating annual mileage')

  //
  // 昨年１年間で、旅行などで利用した移動手段を教えてください
  //
  const otherCarAnnualTravelingTime =
    mobilityAnswer.otherCarAnnualTravelingTime || 0
  const trainAnnualTravelingTime =
    mobilityAnswer.trainAnnuallyTravelingTime || 0
  const busAnnualTravelingTime = mobilityAnswer.busAnnualTravelingTime || 0
  const motorbikeAnnualTravelingTime =
    mobilityAnswer.motorbikeAnnualTravelingTime || 0
  const airplaneAnnualTravelingTime =
    mobilityAnswer.airplaneAnnualTravelingTime || 0
  const ferryAnnualTravelingTime = mobilityAnswer.ferryAnnualTravelingTime || 0

  console.log('getting weeks-per-year-excluding-long-vacations')

  // 年間週数の取得
  params = {
    TableName: parameterTableName,
    Key: {
      category: 'misc',
      key: 'weeks-per-year-excluding-long-vacations'
    }
  }
  data = await dynamodb.get(params).promise()
  let weekCount = 49
  if (data?.Item) {
    weekCount = data.Item.value
  }

  console.log('getting transportation-speed')

  // 時速の取得
  params = {
    TableName: parameterTableName,
    KeyConditions: {
      category: {
        ComparisonOperator: 'EQ',
        AttributeValueList: ['transportation-speed']
      }
    }
  }
  data = await dynamodb.query(params).promise()
  const transportationSpeed = data.Items.reduce((a, x) => {
    a[x.key] = x.value
    return a
  }, {})

  // 飛行機の移動距離の積算
  airplaneMileage +=
    airplaneAnnualTravelingTime * transportationSpeed['airplane-speed']
  // フェリーの移動距離の積算
  ferryMileage +=
    ferryAnnualTravelingTime * transportationSpeed['ferry-velocity']

  // 電車の移動距離の積算
  trainMileage +=
    trainTravelingTime * weekCount * transportationSpeed['train-speed']
  trainAnnualTravelingTime * transportationSpeed['long-distance-train-speed']

  // バスの移動距離の積算
  busMileage +=
    busTravelingTime * weekCount * transportationSpeed['bus-speed'] +
    busAnnualTravelingTime * transportationSpeed['express-bus-speed']

  // バイクの移動距離の積算
  motorbikeMileage +=
    motorbikeTravelingTime *
      weekCount *
      transportationSpeed['motorbike-speed'] +
    motorbikeAnnualTravelingTime *
      transportationSpeed['long-distance-motorbike-speed']

  taxiRatio = taxi.value / (taxi.value + carSharingDriving.value)
  carSharingRatio = 1 - taxiRatio

  // タクシー他、その他の移動の算出
  const otherCarMileage =
    otherCarTravelingTime * weekCount * transportationSpeed['car-speed'] +
    otherCarAnnualTravelingTime * transportationSpeed['long-distance-car-speed']

  // タクシーの移動距離の積算
  taxiMileage += otherCarMileage * taxiRatio
  // カーシェアリングの移動距離の積算
  carSharingMileage += otherCarMileage * carSharingRatio

  // 一部のベースライン値のバックアップ
  const baselineCarSharingDrivingAmount = carSharingDriving.value
  const baselineMotorbikeDrivingAmount = motorbikeDriving.value

  // ベースラインの値を書き換えてEstimationを生成
  const components = [
    airplane,
    train,
    bus,
    ferry,
    taxi,
    carSharingDriving,
    motorbikeDriving
  ]

  const mileages = [
    airplaneMileage,
    trainMileage,
    busMileage,
    ferryMileage,
    taxiMileage,
    carSharingMileage,
    motorbikeMileage
  ]

  for (let i = 0; i < components.length; ++i) {
    components[i].value = mileages[i]
    estimations.push(toEstimation(components[i]))
  }

  // バイクの購入・メンテナンス、カーシェアの回数はベースラインとの比率で変更
  const motorbikeDrivingRatio =
    motorbikeDriving.value / baselineMotorbikeDrivingAmount
  const carSharingDrivingRatio =
    carSharingDriving.value / baselineCarSharingDrivingAmount

  motorbikePurchase.value *= motorbikeDrivingRatio
  carSharingRental.value *= carSharingDrivingRatio
  motorbikeMaintenance.value *= motorbikeDrivingRatio

  estimations.push(toEstimation(motorbikePurchase))
  estimations.push(toEstimation(carSharingRental))
  estimations.push(toEstimation(motorbikeMaintenance))

  console.log(JSON.stringify(estimations))

  return { baselines, estimations }
}
