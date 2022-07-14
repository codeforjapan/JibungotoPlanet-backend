import { toBaseline, findBaseline, toEstimation } from './util'

const estimateOther = async (
  dynamodb,
  housingAnswer,
  otherAnswer,
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

  let residentCount = 2.33
  if (housingAnswer && housingAnswer.residentCount) {
    residentCount = housingAnswer.residentCount
  }

  const answers = [
    // 日用消耗品の支出はどのくらいですか？
    // dailyGoods: String # 5k-less|5k-10k|10k-20k|20k-30k|30k-more|unknown|average-per-capita
    {
      category: 'daily-goods-amount',
      key: otherAnswer.dailyGoodsAmountKey,
      base: 'average-per-capita',
      residentCount: residentCount,
      items: ['sanitation', 'kitchen-goods', 'paper-stationery']
    },

    // 通信費、放送受信料を合わせた支出はどのくらいですか？
    // communication: String # 5k-less|5k10k|10k-20k|20k-30k|30k-more|unknown|average-per-capita
    {
      category: 'communication-amount',
      key: otherAnswer.communicationAmountKey,
      base: 'average-per-capita',
      residentCount: residentCount,
      items: ['communication', 'broadcasting']
    },

    // 過去1年間の家電、家具などの大型な買い物の支出はどのくらいですか？
    // applianceFurniture: String # 50k-less|50k-100k|100k-200k|200k-300k||300k-400k|400k-more|unknown|average-per-capita
    {
      category: 'appliance-furniture-amount',
      key: otherAnswer.applianceFurnitureAmountKey,
      base: 'average-per-capita',
      residentCount: residentCount,
      items: [
        'electrical-appliances-repair-rental',
        'furniture-daily-goods-repair-rental',
        'cooking-appliances',
        'heating-cooling-appliances',
        'other-appliances',
        'electronics',
        'furniture',
        'covering'
      ]
    },

    //  医療、福祉、教育、塾などの習い事の支出はどのくらいですか？
    // service: String # 5k-less|5k-10k|10k-20k|20k-50k|50k-more|unknown
    {
      category: 'service-factor',
      key: otherAnswer.serviceFactorKey,
      items: [
        'medicine',
        'housework',
        'washing',
        'medical-care',
        'nursing',
        'caring',
        'formal-education',
        'informal-education'
      ]
    },

    // 趣味にかかるの物の支出はどのくらいですか？
    // hobbyGoods: String # 5k-less|5k-10k|10k-20k|20k-50k|50k-more|unknown
    {
      category: 'hobby-goods-factor',
      key: otherAnswer.hobbyGoodsFactorKey,
      items: [
        'culture-goods',
        'entertainment-goods',
        'sports-goods',
        'gardening-flower',
        'pet',
        'tobacco',
        'books-magazines',
        'sports-culture-repair-rental',
        'sports-entertainment-repair-rental'
      ]
    },

    // 衣類、かばん、宝飾品、美容関連などの支出はどのくらいですか？
    // clothesBeauty: String # 5k-less|5k-10k|10k-20k|20k-50k|50k-more|unknown
    {
      category: 'clothes-beauty-factor',
      key: otherAnswer.clothesBeautyFactorKey,
      items: [
        'haircare',
        'cosmetics',
        'clothes-goods',
        'bags-jewelries-goods',
        'clothes-repair-rental',
        'bags-jewelries-repair-rental'
      ]
    },

    // レジャー、スポーツへの支出はどのくらいですか？
    // leisureSports: String # 5000-less|5k-10k|10k-20k|20k-50k|50k-more|unknown
    {
      category: 'leisure-sports-factor',
      key: otherAnswer.leisureSportsFactorKey,
      items: [
        'culture-leisure',
        'entertainment-leisure',
        'sports-leisure',
        'bath-spa'
      ]
    },

    // 過去１年間の宿泊を伴う旅行にかかった費用はいくらくらいですか？
    // travel: String # 10k-less|20k-30k|30k-50k|50k-100k|100k-200k|200k-more|unknown
    {
      category: 'travel-factor',
      key: otherAnswer.travelFactorKey,
      items: ['hotel', 'travel']
    }
  ]

  for (let ans of answers) {
    const data = await dynamodb
      .get({
        TableName: parameterTableName,
        Key: {
          category: ans.category,
          key: ans.key
        }
      })
      .promise()

    let denominator = 1

    if (ans.base) {
      if (ans.key === 'unknown') {
        // 国平均の支出額（average-per-capita）が指定されていて、わからない、の回答の場合は
        // 国平均に対する比率は1倍。denominatorをundefinedにして計算に使わないようにする。
        denominator = undefined
      } else {
        const base = await dynamodb
          .get({
            TableName: parameterTableName,
            Key: {
              category: ans.category,
              key: ans.base
            }
          })
          .promise()
        if (base?.Item?.value) {
          // 分母は国平均の支出額（average-per-capita） * 居住人数
          denominator = base.Item.value * residentCount
        }
      }
    }

    if (data?.Item?.value) {
      const coefficient = denominator ? data.Item.value / denominator : 1
      for (let item of ans.items) {
        const baseline = findAmount(baselines, item)
        baseline.value *= coefficient
        estimations.push(toEstimation(baseline))
      }
    }
  }

  return { baselines, estimations }
}

export { estimateOther }
