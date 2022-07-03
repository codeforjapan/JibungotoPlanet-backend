import { toBaseline, findBaseline, toEstimation } from './util'

const estimateFood = async (
  dynamodb,
  foodAnswer,
  footprintTableName,
  parameterTableName
) => {
  // foodのベースラインの取得
  const findAmount = (baselines, item) =>
    findBaseline(baselines, 'food', item, 'amount')

  // const findIntensity = (baselines, item) => findBaseline(baselines, 'food', item, 'intensity')

  // foodAnswerのスキーマと取りうる値は以下を参照。
  // amplify/backend/api/JibungotoPlanetGql/schema.graphql
  const estimations = []

  // ベースラインのフットプリントを取得
  const params = {
    TableName: footprintTableName,
    KeyConditions: {
      dirAndDomain: {
        ComparisonOperator: 'EQ',
        AttributeValueList: ['baseline_food']
      }
    }
  }

  const data = await dynamodb.query(params).promise()
  const baselines = data.Items.map((item) => toBaseline(item))

  // 回答がない場合はベースラインのみ返す
  if (!foodAnswer) {
    return { baselines, estimations }
  }

  //
  // 答えに従ってestimationを計算
  //

  //
  // 1日の活動量（摂取カロリー量）はどのくらいですか？
  //
  // 全体の補正値
  //
  // foodIntake: String # very-little|somewhat-little|moderate|somewhat-much|very-much
  //
  // 食材を捨てたり食べ残し（食品ロス）が生じる頻度はどのくらいですか？
  //
  // foodDirectwaste: String # seldom|1-per-week|2-3-per-week|4-7-per-week|8-or-more-per-week|unknown
  // foodLeftover: String # seldom|1-per-week|2-3-per-week|4-7-per-week|8-or-more-per-week|unknown
  //

  //
  // ここから個別補正
  //
  // ※ちなみに以下は個別の補正なし。
  // rice
  // bread-flour
  // noodle
  // potatoes
  // vegetables
  // processedvegetables
  // beans
  // othermeat
  // processedmeat
  // fruits
  // oil
  // seasoning
  // readymeal

  const answers = [
    //
    // 普段の食生活を教えてください
    //
    // dishBeef: String # everyday|4-5-per-week|2-3-per-week|1-per-week|2-3-per-month|1-less-per-month|never|unknown
    {
      category: 'dish-beef-factor',
      key: foodAnswer.dishBeef,
      items: ['beef']
    },
    // dishPork: String # everyday|4-5-per-week|2-3-per-week|1-per-week|2-3-per-month|1-less-per-month|never|unknown
    {
      category: 'dish-pork-factor',
      key: foodAnswer.dishPork,
      items: ['pork']
    },
    // dishChicken: String # everyday|4-5-per-week|2-3-per-week|1-per-week|2-3-per-month|1-less-per-month|never|unknown
    {
      category: 'dish-chicken-factor',
      key: foodAnswer.dishChicken,
      items: ['chicken']
    },
    // dishSeafood: String # everyday|4-5-per-week|2-3-per-week|1-per-week|2-3-per-month|1-less-per-month|never|unknown
    {
      category: 'dish-seafood-factor',
      key: foodAnswer.dishSeafood,
      items: ['fish', 'processedfish']
    },
    // dairyFood: String # 3-more-per-day|2-per-day|1-per-day|half-of-week|1-2-less-per-week|never|unknown
    {
      category: 'dairy-food-factor',
      key: foodAnswer.dairyFood,
      items: ['milk', 'otherdairy', 'eggs']
    },
    //
    // １週間にどのくらいの頻度でお酒を飲みますか？
    //
    // alcohol: String # everyday|4-5-per-week|2-3-per-week|1-per-week|2-3-per-month|1-less-per-month|never|unknown
    {
      category: 'alcohol-factor',
      key: foodAnswer.alcohol,
      items: ['alcohol']
    }
  ]

  for (const ans of answers) {
    console.log(ans.category)
    const params = {
      TableName: parameterTableName,
      Key: {
        category: ans.category,
        key: ans.key
      }
    }
    const data = await dynamodb.get(params).promise()
    if (data?.Item?.value) {
      const coefficient = data.Item.value
      for (const item of ans.items) {
        const component = findAmount(baselines, item)
        component.value *= coefficient
        estimations.push(toEstimation(component))
      }
    }
  }

  // お酒以外の飲み物、お菓子類の1ヶ月の支出はどのくらいですか？
  //
  // softdrinkSnack: String #3000-less|3000-5000|5000-10000|10000-15000|15000-more|unknown
  // sweets-snack
  // coffee-tea
  // colddrink
  //
  // 1ヶ月の外食費はどのくらいですか？
  //
  // eatout: String # 5000-less|5000-10000|10000-20000|20000-50000|50000-more|unknown
  // restaurant
  // barcafe

  console.log(JSON.stringify(estimations))
  return { baselines, estimations }
}

export { estimateFood }
