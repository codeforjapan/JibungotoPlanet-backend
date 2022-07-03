import { toBaseline, findBaseline, toEstimation } from './util'

const estimateMobility = async (
  dynamodb,
  mobilityAnswer,
  footprintTableName,
  parameterTableName
) => {
  // mobilityのベースラインの取得
  const findAmount = (baselines, item) =>
    findBaseline(baselines, 'mobility', item, 'amount')
  const findIntensity = (baselines, item) =>
    findBaseline(baselines, 'mobility', item, 'intensity')

  // mobilityAnswerのスキーマと取りうる値は以下を参照。
  // amplify/backend/api/JibungotoPlanetGql/schema.graphql
  const estimations = []

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
  const baselines = data.Items.map((item) => toBaseline(item))

  // 回答がない場合はベースラインのみ返す
  if (!mobilityAnswer) {
    return { baselines, estimations }
  }

  //
  // 答えに従ってestimationを計算
  //

  // 自家用車をお持ちですか？がYesの場合
  if (mobilityAnswer.hasPrivateCar) {
    if (mobilityAnswer.carIntensityFactorKey) {
      const intensity = findIntensity(baselines, 'private-car-driving')

      // 自家用車の場合は、自動車種類に応じて運転時GHG原単位を取得
      const params = {
        TableName: parameterTableName,
        Key: {
          category: 'car-intensity-factor',
          key: mobilityAnswer.carIntensityFactorKey
        }
      }
      let data = await dynamodb.get(params).promise()
      if (data?.Item) {
        intensity.value = data.Item.value
      }

      // 人数補正値
      const carPassengersKey =
        mobilityAnswer.carPassengersKey || 'unknown_private-car-factor'
      params.Key = {
        category: 'car-passengers',
        key: carPassengersKey
      }
      data = await dynamodb.get(params).promise()
      const ratio = data?.Item?.value || 1

      console.log('private-car-driving-intensity = ' + intensity.value)
      console.log(
        'carPassengersKey = ' +
          carPassengersKey +
          ', private-car-factor = ' +
          ratio
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
  const estimationAmount = {
    airplane: findAmount(baselines, 'airplane'),
    train: findAmount(baselines, 'train'),
    bus: findAmount(baselines, 'bus'),
    ferry: findAmount(baselines, 'ferry'),
    taxi: findAmount(baselines, 'taxi'),
    carSharing: findAmount(baselines, 'car-sharing-driving'),
    motorbike: findAmount(baselines, 'motorbike-driving'),
    motorbikePurchase: findAmount(baselines, 'motorbike-purchase'),
    carSharingRental: findAmount(baselines, 'car-sharing-rental'),
    motorbikeMaintenance: findAmount(baselines, 'motorbike-maintenance')
  }

  const mileage = {
    airplane: 0,
    ferry: 0,
    train: 0,
    bus: 0,
    motorbike: 0,
    taxi: 0,
    carSharing: 0
  }

  // 自家用車以外の移動手段（weekly）
  const weeklyTravelingTime = {
    train: 0,
    bus: 0,
    motorbike: 0,
    otherCar: 0
  }

  //
  // 自家用車以外の普通の移動手段を教えて下さい
  //
  if (mobilityAnswer.hasWeeklyTravelingTime) {
    weeklyTravelingTime.train = mobilityAnswer.trainWeeklyTravelingTime || 0
    weeklyTravelingTime.bus = mobilityAnswer.busWeeklyTravelingTime || 0
    weeklyTravelingTime.motorbike =
      mobilityAnswer.motorbikeWeeklyTravelingTime || 0
    weeklyTravelingTime.otherCar =
      mobilityAnswer.otherCarWeeklyTravelingTime || 0
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
    const milageByArea = data.Items.reduce((a, x) => {
      a[x.key] = x.value
      return a
    }, {})

    mileage.train = milageByArea[mileageByAreaFirstKey + '_train']
    mileage.bus = milageByArea[mileageByAreaFirstKey + '_bus']
    mileage.motorbike = milageByArea[mileageByAreaFirstKey + '_motorbike']
    mileage.taxi = milageByArea[mileageByAreaFirstKey + '_taxi']
    mileage.carSharing = milageByArea[mileageByAreaFirstKey + 'car-sharing']
  }

  console.log('calculating annual mileage')

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

  console.log('getting weeks-per-year-excluding-long-vacations')

  // 年間週数の取得
  const params_wpyelv = {
    TableName: parameterTableName,
    Key: {
      category: 'misc',
      key: 'weeks-per-year-excluding-long-vacations'
    }
  }
  data = await dynamodb.get(params_wpyelv).promise()
  let weekCount = 49
  if (data?.Item) {
    weekCount = data.Item.value
  }

  console.log('getting transportation-speed')

  // 時速の取得
  const params_ts = {
    TableName: parameterTableName,
    KeyConditions: {
      category: {
        ComparisonOperator: 'EQ',
        AttributeValueList: ['transportation-speed']
      }
    }
  }
  data = await dynamodb.query(params_ts).promise()
  const speed = data.Items.reduce((a, x) => {
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

  const items = [
    'airplane',
    'train',
    'bus',
    'ferry',
    'taxi',
    'carSharing',
    'motorbike'
  ]

  for (let item of items) {
    estimationAmount[item].value = mileage[item]
    estimations.push(toEstimation(estimationAmount[item]))
  }

  // バイクの購入・メンテナンス、カーシェアの回数はベースラインとの比率で変更
  const motorbikeDrivingRatio =
    estimationAmount.motorbike.value / baselineMotorbikeAmount
  const carSharingDrivingRatio =
    estimationAmount.carSharing.value / baselineCarSharingAmount

  estimationAmount.motorbikePurchase.value *= motorbikeDrivingRatio
  estimationAmount.carSharingRental.value *= carSharingDrivingRatio
  estimationAmount.motorbikeMaintenance.value *= motorbikeDrivingRatio

  estimations.push(toEstimation(estimationAmount.motorbikePurchase))
  estimations.push(toEstimation(estimationAmount.carSharingRental))
  estimations.push(toEstimation(estimationAmount.motorbikeMaintenance))

  console.log(JSON.stringify(estimations))

  return { baselines, estimations }
}

export { estimateMobility }
