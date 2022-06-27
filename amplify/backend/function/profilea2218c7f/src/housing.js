const { toComponent, findComponent, toEstimation } = require('./util')

module.exports.estimateHousing = async (
  dynamodb,
  housingAnswer,
  footprintTableName,
  parameterTableName
) => {
  const findAmount = (baselines, item) =>
      findComponent(baselines, 'housing', item, 'amount')
  const findIntensity = (baselines, item) =>
      findComponent(baselines, 'housing', item, 'intensity')

  // housingAnswerのスキーマと取りうる値は以下を参照
  // amplify/backend/api/JibungotoPlanetGql/schema.graphql
  let estimations = []

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
  const baselines = data.Items.map((item) => toComponent(item))

  // 回答がない場合はベースラインのみ返す
  if (!housingAnswer) {
    return { baselines, estimations }
  }

  const numberOfPeople = housingAnswer.numberOfPeople;


  const imputedRent = findAmount(baselines, 'imputedrent');
  const rent = findAmount(baselines, 'rent');
  const housingMaintenance = findAmount(baselines, 'housing-maintenance');
  const electricity = findAmount(baselines, 'electricity');
  const urbanGas = findAmount(baselines, 'urbangas');
  const lpg = findAmount(baselines, 'lpg');
  const kerosene = findAmount(baselines, 'kerosene');

  if (housingAnswer.housingAmountByRegion) {
    const housingSizeParams = {
      TableName: parameterTableName,
      KeyConditions: {
        category: {
          ComparisonOperator: 'EQ',
          AttributeValueList: ['housing-size']
        },
        key: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [housingAnswer.housingSize]
        }
      }
    }
    const housingSize = await dynamodb.query(housingSizeParams).promise()
    const housingSizePerPeople = housingSize.data?.value / numberOfPeople

  }



  //
  // 答えに従ってestimationを計算
  //

  //
  // # お住まいの地域（地方）はどちらですか？
  //
  // 全体の補正値
  //
  // housingAmountByRegion: String # northeast|middle|southwest|unknown
  //



  //
  // ここから個別補正
  //
  // ※ちなみに以下は個別の補正なし。
  // landrent
  // otherenergy
  // water


  // 灯油の使用の有無
  if (housingAnswer.useKerosene) {
    if (housingAnswer.howManyKerosene && housingAnswer.howManyKeroseneMonth) {
      kerosene.value = housingAnswer.howManyKerosene * housingAnswer.howManyKeroseneMonth / numberOfPeople
    } else {
      kerosene.value = findAmount(baselines, 'kerosene');
      if (housingAnswer.housingAmountByRegion) {
        const keroseneParams = {
          TableName: parameterTableName,
          KeyConditions: {
            category: {
              ComparisonOperator: 'EQ',
              AttributeValueList: ['housing-amount-by-region']
            },
            key: {
              ComparisonOperator: 'EQ',
              AttributeValueList: [housingAnswer.housingAmountByRegion + '_kerosene-amount']
            }
          }
        }
        const keroseneByRegion = await dynamodb.query(keroseneParams).promise()
        kerosene.value = keroseneByRegion.data?.value
      }
    }
  } else {
    kerosene.value = 0
  }

  estimations.push(toEstimation(kerosene))
  const answers = [
    //
    // あなたの家の部屋はいくつありますか？
    //
    // housingSize: String # 1-room|2-room|3-room|4-room|5-6-room|7-more-room|unknown
    {
      category: 'housing-size',
      key: housingAnswer.housingSize,
      items: ['']
    },
  ]

  for (let ans of answers) {
    console.log(ans.category)
    const params = {
      TableName: parameterTableName,
      Key: {
        category: ans.category,
        key: ans.key
      }
    }
    let data = await dynamodb.get(params).promise()
    if (data?.Item?.value) {
      const coefficient = data.Item.value
      for (let item of ans.items) {
        const component = findAmount(baselines, item)
        component.value *= coefficient
        estimations.push(toEstimation(component))
      }
    }
  }


  console.log(JSON.stringify(estimations))
  return { baselines, estimations }
}
