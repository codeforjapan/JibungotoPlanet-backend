import { toBaseline, findBaseline, toEstimation } from './util'

const estimateOther = async (
  dynamodb,
  otherAnswer,
  housingAnswer,
  footprintTableName,
  parameterTableName
) => {
  // foodのベースラインの取得
  const findAmount = (baselines, item) =>
    findBaseline(baselines, 'other', item, 'amount')

  // otherAnswerのスキーマと取りうる値は以下を参照。
  // amplify/backend/api/JibungotoPlanetGql/schema.graphql
  const estimations = []

  // ベースラインのフットプリントを取得
  const params = {
    TableName: footprintTableName,
    KeyConditions: {
      dir_domain: {
        ComparisonOperator: 'EQ',
        AttributeValueList: ['baseline_other']
      }
    }
  }

  const data = await dynamodb.query(params).promise()
  const baselines = data.Items.map((item) => toBaseline(item))

  // 回答がない場合はベースラインのみ返す
  if (!otherAnswer) {
    return { baselines, estimations }
  }

  // 個別補正がない項目
  // postal-delivery
  // ceremony
  // finance-insurance
  // other-services

  const estimationAmount = {
    'cooking-appliances': findAmount(baselines, 'cooking-appliances'),
    'heating-cooling-appliances': findAmount(
      baselines,
      'heating-cooling-appliances'
    ),
    'other-appliances': findAmount(baselines, 'other-appliances'),
    electronics: findAmount(baselines, 'electronics'),
    'clothes-goods': findAmount(baselines, 'clothes-goods'),
    'bags-jewelries-goods': findAmount(baselines, 'bags-jewelries-goods'),
    'culture-goods': findAmount(baselines, 'culture-goods'),
    'entertainment-goods': findAmount(baselines, 'entertainment-goods'),
    'sports-goods': findAmount(baselines, 'sports-goods'),
    'gardening-flower': findAmount(baselines, 'gardening-flower'),
    pet: findAmount(baselines, 'pet'),
    tobacco: findAmount(baselines, 'tobacco'),
    furniture: findAmount(baselines, 'furniture'),
    covering: findAmount(baselines, 'covering'),
    cosmetics: findAmount(baselines, 'cosmetics'),
    sanitation: findAmount(baselines, 'sanitation'),
    medicine: findAmount(baselines, 'medicine'),
    'kitchen-goods': findAmount(baselines, 'kitchen-goods'),
    'paper-stationery': findAmount(baselines, 'paper-stationery'),
    'books-magazines': findAmount(baselines, 'books-magazines'),
    waste: findAmount(baselines, 'waste'),
    hotel: findAmount(baselines, 'hotel'),
    travel: findAmount(baselines, 'travel'),
    'culture-leisure': findAmount(baselines, 'culture-leisure'),
    'entertainment-leisure': findAmount(baselines, 'entertainment-leisure'),
    'sports-leisure': findAmount(baselines, 'sports-leisure'),
    'furniture-daily-goods-repair-rental': findAmount(
      baselines,
      'furniture-daily-goods-repair-rental'
    ),
    'clothes-repair-rental': findAmount(baselines, 'clothes-repair-rental'),
    'bags-jewelries-repair-rental': findAmount(
      baselines,
      'bags-jewelries-repair-rental'
    ),
    'electrical-appliances-repair-rental': findAmount(
      baselines,
      'electrical-appliances-repair-rental'
    ),
    'sports-culture-repair-rental': findAmount(
      baselines,
      'sports-culture-repair-rental'
    ),
    'sports-entertainment-repair-rental': findAmount(
      baselines,
      'sports-entertainment-repair-rental'
    ),
    housework: findAmount(baselines, 'housework'),
    washing: findAmount(baselines, 'washing'),
    haircare: findAmount(baselines, 'haircare'),
    'bath-spa': findAmount(baselines, 'bath-spa'),
    communication: findAmount(baselines, 'communication'),
    broadcasting: findAmount(baselines, 'broadcasting'),
    'medical-care': findAmount(baselines, 'medical-care'),
    nursing: findAmount(baselines, 'nursing'),
    caring: findAmount(baselines, 'caring'),
    'formal-education': findAmount(baselines, 'formal-education'),
    'informal-education': findAmount(baselines, 'informal-education'),
    'other-services': findAmount(baselines, 'other-services')
  }

  // $326
  let dailyGoodsAmount = null
  if (otherAnswer.dailyGoodsAmountKey && housingAnswer.residentCount) {
    dailyGoodsAmount = await dynamodb
      .get({
        TableName: parameterTableName,
        Key: {
          category: 'daily-goods-amount',
          key: otherAnswer.dailyGoodsAmountKey
        }
      })
      .promise()
    const dailyGoodsAmountAverage = await dynamodb
      .get({
        TableName: parameterTableName,
        Key: {
          category: 'daily-goods-amount',
          key: 'average-per-capita'
        }
      })
      .promise()

    // 住居の部分から人数を取得する必要がある。
    const dailyGoodsNationalAverageRatio =
      dailyGoodsAmount.Item?.value /
      housingAnswer.residentCount /
      dailyGoodsAmountAverage.Item?.value
    estimationAmount.sanitation.value =
      estimationAmount.sanitation.value * dailyGoodsNationalAverageRatio
    estimationAmount['kitchen-goods'].value =
      estimationAmount['kitchen-goods'].value * dailyGoodsNationalAverageRatio
    estimationAmount['paper-stationery'].value =
      estimationAmount['paper-stationery'].value *
      dailyGoodsNationalAverageRatio
    estimations.push(toEstimation(estimationAmount.sanitation))
    estimations.push(toEstimation(estimationAmount['kitchen-goods']))
    estimations.push(toEstimation(estimationAmount['paper-stationery']))
  }

  // $336
  if (otherAnswer.communicationAmountKey && housingAnswer.residentCount) {
    const communicationAmount = await dynamodb
      .get({
        TableName: parameterTableName,
        Key: {
          category: 'communication-amount',
          key: otherAnswer.communicationAmountKey
        }
      })
      .promise()
    const communicationAmountAverage = await dynamodb
      .get({
        TableName: parameterTableName,
        Key: {
          category: 'communication-amount',
          key: 'average-per-capita'
        }
      })
      .promise()

    // 住居の部分から人数を取得する必要がある。
    const communicationNationalAverageRatio =
      communicationAmount.Item?.value /
      housingAnswer.residentCount /
      communicationAmountAverage.Item?.value
    estimationAmount.communication.value =
      estimationAmount.communication.value * communicationNationalAverageRatio
    estimationAmount.broadcasting.value =
      estimationAmount.broadcasting.value * communicationNationalAverageRatio
    estimations.push(toEstimation(estimationAmount.communication))
    estimations.push(toEstimation(estimationAmount.broadcasting))
  }

  // $355
  let applianceFurnitureAmount = null
  if (otherAnswer.applianceFurnitureAmountKey && housingAnswer.residentCount) {
    applianceFurnitureAmount = await dynamodb
      .get({
        TableName: parameterTableName,
        Key: {
          category: 'appliance-furniture-amount',
          key: otherAnswer.applianceFurnitureAmountKey
        }
      })
      .promise()
    const applianceFurnitureAmountAverage = await dynamodb
      .get({
        TableName: parameterTableName,
        Key: {
          category: 'appliance-furniture-amount',
          key: 'average-per-capita'
        }
      })
      .promise()

    // 住居の部分から人数を取得する必要がある。
    const applianceFurnitureNationalAverageRatio =
      applianceFurnitureAmount.Item?.value /
      housingAnswer.residentCount /
      applianceFurnitureAmountAverage.Item?.value
    estimationAmount['cooking-appliances'].value =
      estimationAmount['cooking-appliances'].value *
      applianceFurnitureNationalAverageRatio
    estimationAmount['heating-cooling-appliances'].value =
      estimationAmount['heating-cooling-appliances'].value *
      applianceFurnitureNationalAverageRatio
    estimationAmount['other-appliances'].value =
      estimationAmount['other-appliances'].value *
      applianceFurnitureNationalAverageRatio
    estimationAmount.electronics.value =
      estimationAmount.electronics.value *
      applianceFurnitureNationalAverageRatio
    estimationAmount.furniture.value =
      estimationAmount.furniture.value * applianceFurnitureNationalAverageRatio
    estimationAmount.covering.value =
      estimationAmount.covering.value * applianceFurnitureNationalAverageRatio
    estimationAmount['furniture-daily-goods-repair-rental'].value =
      estimationAmount['furniture-daily-goods-repair-rental'].value *
      applianceFurnitureNationalAverageRatio
    estimationAmount['electrical-appliances-repair-rental'].value =
      estimationAmount['electrical-appliances-repair-rental'].value *
      applianceFurnitureNationalAverageRatio
    estimations.push(toEstimation(estimationAmount['cooking-appliances']))
    estimations.push(
      toEstimation(estimationAmount['heating-cooling-appliances'])
    )
    estimations.push(toEstimation(estimationAmount['other-appliances']))
    estimations.push(toEstimation(estimationAmount.electronics))
    estimations.push(toEstimation(estimationAmount.furniture))
    estimations.push(toEstimation(estimationAmount.covering))
    estimations.push(
      toEstimation(estimationAmount['furniture-daily-goods-repair-rental'])
    )
    estimations.push(
      toEstimation(estimationAmount['electrical-appliances-repair-rental'])
    )
  }

  // $340
  let serviceFactor = null
  if (otherAnswer.serviceFactorKey) {
    serviceFactor = await dynamodb
      .get({
        TableName: parameterTableName,
        Key: {
          category: 'service-factor',
          key: otherAnswer.serviceFactorKey
        }
      })
      .promise()

    estimationAmount.medicine.value =
      estimationAmount.medicine.value * serviceFactor.Item?.value
    estimationAmount.housework.value =
      estimationAmount.housework.value * serviceFactor.Item?.value
    estimationAmount.washing.value =
      estimationAmount.washing.value * serviceFactor.Item?.value
    estimationAmount['medical-care'].value =
      estimationAmount['medical-care'].value * serviceFactor.Item?.value
    estimationAmount.nursing.value =
      estimationAmount.nursing.value * serviceFactor.Item?.value
    estimationAmount.caring.value =
      estimationAmount.caring.value * serviceFactor.Item?.value
    estimationAmount['formal-education'].value =
      estimationAmount['formal-education'].value * serviceFactor.Item?.value
    estimationAmount['informal-education'].value =
      estimationAmount['informal-education'].value * serviceFactor.Item?.value
    estimations.push(toEstimation(estimationAmount.medicine))
    estimations.push(toEstimation(estimationAmount.housework))
    estimations.push(toEstimation(estimationAmount.washing))
    estimations.push(toEstimation(estimationAmount['medical-care']))
    estimations.push(toEstimation(estimationAmount.nursing))
    estimations.push(toEstimation(estimationAmount.caring))
    estimations.push(toEstimation(estimationAmount['formal-education']))
    estimations.push(toEstimation(estimationAmount['informal-education']))
  }

  // $310
  let hobbyGoodsFactor = null
  if (otherAnswer.hobbyGoodsFactorKey) {
    hobbyGoodsFactor = await dynamodb
      .get({
        TableName: parameterTableName,
        Key: {
          category: 'hobby-goods-factor',
          key: otherAnswer.hobbyGoodsFactorKey
        }
      })
      .promise()

    estimationAmount['culture-goods'].value =
      estimationAmount['culture-goods'].value * hobbyGoodsFactor.Item?.value
    estimationAmount['entertainment-goods'].value =
      estimationAmount['entertainment-goods'].value *
      hobbyGoodsFactor.Item?.value
    estimationAmount['sports-goods'].value =
      estimationAmount['sports-goods'].value * hobbyGoodsFactor.Item?.value
    estimationAmount['gardening-flower'].value =
      estimationAmount['gardening-flower'].value * hobbyGoodsFactor.Item?.value
    estimationAmount.pet.value =
      estimationAmount.pet.value * hobbyGoodsFactor.Item?.value
    estimationAmount.tobacco.value =
      estimationAmount.tobacco.value * hobbyGoodsFactor.Item?.value
    estimationAmount['books-magazines'].value =
      estimationAmount['books-magazines'].value * hobbyGoodsFactor.Item?.value
    estimationAmount['sports-culture-repair-rental'].value =
      estimationAmount['sports-culture-repair-rental'].value *
      hobbyGoodsFactor.Item?.value
    estimationAmount['sports-entertainment-repair-rental'].value =
      estimationAmount['sports-entertainment-repair-rental'].value *
      hobbyGoodsFactor.Item?.value
    estimations.push(toEstimation(estimationAmount['culture-goods']))
    estimations.push(toEstimation(estimationAmount['entertainment-goods']))
    estimations.push(toEstimation(estimationAmount['sports-goods']))
    estimations.push(toEstimation(estimationAmount['gardening-flower']))
    estimations.push(toEstimation(estimationAmount.pet))
    estimations.push(toEstimation(estimationAmount.tobacco))
    estimations.push(toEstimation(estimationAmount['books-magazines']))
    estimations.push(
      toEstimation(estimationAmount['sports-culture-repair-rental'])
    )
    estimations.push(
      toEstimation(estimationAmount['sports-entertainment-repair-rental'])
    )
  }

  // $299
  let clothesBeautyFactor = null
  if (otherAnswer.clothesBeautyFactorKey) {
    clothesBeautyFactor = await dynamodb
      .get({
        TableName: parameterTableName,
        Key: {
          category: 'clothes-beauty-factor',
          key: otherAnswer.clothesBeautyFactorKey
        }
      })
      .promise()

    estimationAmount['clothes-goods'].value =
      estimationAmount['clothes-goods'].value * clothesBeautyFactor.Item?.value
    estimationAmount['bags-jewelries-goods'].value =
      estimationAmount['bags-jewelries-goods'].value *
      clothesBeautyFactor.Item?.value
    estimationAmount.cosmetics.value =
      estimationAmount.cosmetics.value * clothesBeautyFactor.Item?.value
    estimationAmount['clothes-repair-rental'].value =
      estimationAmount['clothes-repair-rental'].value *
      clothesBeautyFactor.Item?.value
    estimationAmount['bags-jewelries-repair-rental'].value =
      estimationAmount['bags-jewelries-repair-rental'].value *
      clothesBeautyFactor.Item?.value
    estimationAmount.haircare.value =
      estimationAmount.haircare.value * clothesBeautyFactor.Item?.value
    estimations.push(toEstimation(estimationAmount['clothes-goods']))
    estimations.push(toEstimation(estimationAmount['bags-jewelries-goods']))
    estimations.push(toEstimation(estimationAmount.cosmetics))
    estimations.push(toEstimation(estimationAmount['clothes-repair-rental']))
    estimations.push(
      toEstimation(estimationAmount['bags-jewelries-repair-rental'])
    )
    estimations.push(toEstimation(estimationAmount.haircare))
  }

  // $355 $299 $310 $326 $340
  if (
    applianceFurnitureAmount &&
    clothesBeautyFactor &&
    hobbyGoodsFactor &&
    dailyGoodsAmount &&
    serviceFactor
  ) {
    estimationAmount.waste.value =
      (estimationAmount.waste.value /
        (findAmount(baselines, 'cooking-appliances').value +
          findAmount(baselines, 'heating-cooling-appliances').value +
          findAmount(baselines, 'other-appliances').value +
          findAmount(baselines, 'electronics').value +
          findAmount(baselines, 'clothes-goods').value +
          findAmount(baselines, 'bags-jewelries-goods').value +
          findAmount(baselines, 'culture-goods').value +
          findAmount(baselines, 'entertainment-goods').value +
          findAmount(baselines, 'sports-goods').value +
          findAmount(baselines, 'gardening-flower').value +
          findAmount(baselines, 'pet').value +
          findAmount(baselines, 'tobacco').value +
          findAmount(baselines, 'furniture').value +
          findAmount(baselines, 'covering').value +
          findAmount(baselines, 'cosmetics').value +
          findAmount(baselines, 'sanitation').value +
          findAmount(baselines, 'medicine').value +
          findAmount(baselines, 'kitchen-goods').value +
          findAmount(baselines, 'paper-stationery').value +
          findAmount(baselines, 'books-magazines').value)) *
      (estimationAmount['cooking-appliances'].value +
        estimationAmount['heating-cooling-appliances'].value +
        estimationAmount['other-appliances'].value +
        estimationAmount.electronics.value +
        estimationAmount['clothes-goods'].value +
        estimationAmount['bags-jewelries-goods'].value +
        estimationAmount['culture-goods'].value +
        estimationAmount['entertainment-goods'].value +
        estimationAmount['sports-goods'].value +
        estimationAmount['gardening-flower'].value +
        estimationAmount.pet.value +
        estimationAmount.tobacco.value +
        estimationAmount.furniture.value +
        estimationAmount.covering.value +
        estimationAmount.cosmetics.value +
        estimationAmount.sanitation.value +
        estimationAmount.medicine.value +
        estimationAmount['kitchen-goods'].value +
        estimationAmount['paper-stationery'].value +
        estimationAmount['books-magazines'].value)
    estimations.push(toEstimation(estimationAmount.waste))
  }

  // $361
  if (otherAnswer.leisureSportsFactorKey) {
    const leisureSportsFactor = await dynamodb
      .get({
        TableName: parameterTableName,
        Key: {
          category: 'leisure-sports-factor',
          key: otherAnswer.leisureSportsFactorKey
        }
      })
      .promise()

    estimationAmount['culture-leisure'].value =
      estimationAmount['culture-leisure'].value *
      leisureSportsFactor.Item?.value
    estimationAmount['entertainment-leisure'].value =
      estimationAmount['entertainment-leisure'].value *
      leisureSportsFactor.Item?.value
    estimationAmount['sports-leisure'].value =
      estimationAmount['sports-leisure'].value * leisureSportsFactor.Item?.value
    estimationAmount['bath-spa'].value =
      estimationAmount['bath-spa'].value * leisureSportsFactor.Item?.value
    estimations.push(toEstimation(estimationAmount['culture-leisure']))
    estimations.push(toEstimation(estimationAmount['entertainment-leisure']))
    estimations.push(toEstimation(estimationAmount['sports-leisure']))
    estimations.push(toEstimation(estimationAmount['bath-spa']))
  }

  // $370
  if (otherAnswer.travelFactorKey) {
    const travelFactor = await dynamodb
      .get({
        TableName: parameterTableName,
        Key: {
          category: 'travel-factor',
          key: otherAnswer.travelFactorKey
        }
      })
      .promise()

    estimationAmount.hotel.value =
      estimationAmount.hotel.value * travelFactor.Item?.value
    estimationAmount.travel.value =
      estimationAmount.travel.value * travelFactor.Item?.value
    estimations.push(toEstimation(estimationAmount.hotel))
    estimations.push(toEstimation(estimationAmount.travel))
  }

  console.log(JSON.stringify(estimations))
  return { baselines, estimations }
}

export { estimateOther }
