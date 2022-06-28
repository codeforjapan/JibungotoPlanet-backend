const { toComponent, findComponent, toEstimation } = require('./util')

module.exports.estimateHousing = async (
  dynamodb,
  housingAnswer,
  footprintTableName,
  parameterTableName
) => {
  const findAmount = (baselines, item) =>
      findComponent(baselines, 'housing', item, 'amount')

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

  const estimationAmount = {
    "landrent": findAmount(baselines,'landrent'),
    "otherenergy": findAmount(baselines,'otherenergy'),
    "water": findAmount(baselines, "water"),
    "imputedrent": findAmount(baselines, "imputedrent"),
    "rent": findAmount(baselines, "rent"),
    "housing-maintenance": findAmount(baselines, "housing-maintenance"),
    "electricity": findAmount(baselines, "electricity"),
    "urbangas": findAmount(baselines, "urbangas"),
    "lpg": findAmount(baselines, "lpg"),
    "kerosene": findAmount(baselines, "kerosene"),
  }

  //
  // # お住まいの地域（地方）はどちらですか？
  //
  // 全体の補正値
  //
  // housingAmountByRegion: String # northeast|middle|southwest|unknown
  //
  if (housingAnswer.housingAmountByRegion) {
    const housingAmountByRegion = housingAnswer.housingAmountByRegion;
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
    const re = new RegExp(`${housingAmountByRegion}_(.*)-amount`);

    amountByRegion.Items.forEach((item) => {
      const key = item.key.match(re)[1];
      estimationAmount[key].value = item.value
      estimations.push(toEstimation(estimationAmount[key]))
    })
  }

  //
  // ここから個別補正
  //
  // ※ちなみに以下は個別の補正なし。
  // landrent
  // otherenergy
  // water

  if(housingAnswer.housingSize) {
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
    const housingSizePerPeople = housingSize.Items[0]?.value / numberOfPeople
    const imputedRentValue = estimationAmount.imputedrent.value
    const rentValue = estimationAmount.rent.value
    estimationAmount.imputedrent.value = housingSizePerPeople/(imputedRentValue + rentValue) * imputedRentValue
    estimationAmount.rent.value = housingSizePerPeople/(imputedRentValue + rentValue) * rentValue
    estimationAmount["housing-maintenance"].value = estimationAmount["housing-maintenance"].value / (imputedRentValue + rentValue) * (estimationAmount.imputedrent.value + estimationAmount.rent.value)
  }

  // 灯油の使用の有無
  if (housingAnswer.useKerosene) {
    if (housingAnswer.howManyKerosene && housingAnswer.howManyKeroseneMonth) {
      estimationAmount.kerosene.value = housingAnswer.howManyKerosene * housingAnswer.howManyKeroseneMonth / numberOfPeople
    } else {
      estimationAmount.kerosene.value = findAmount(baselines, 'kerosene');
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
        estimationAmount.kerosene.value = keroseneByRegion.Items[0]?.value
      }
    }
    estimations.push(toEstimation(estimationAmount.kerosene))
  } else {
    estimationAmount.kerosene.value = 0
    estimations.push(toEstimation(estimationAmount.kerosene))
  }

  console.log(JSON.stringify(estimations))
  return { baselines, estimations }
  // return { estimations }
}
