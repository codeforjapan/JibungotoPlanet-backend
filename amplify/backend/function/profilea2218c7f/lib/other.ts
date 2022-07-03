import { toBaseline, findBaseline, toEstimation } from './util'

const estimateOther = async (
  dynamodb,
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
      dirAndDomain: {
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

  const answers = [
    // 日用消耗品の支出はどのくらいですか？
    // dailyGoods: String # 5k-less|5k-10k|10k-20k|20k-30k|30k-more|unknown|average-per-capita
    // daily-goods-medicine 日用品・化粧品・医薬品
    {
      category: 'clothes-beauty-factor',
      key: otherAnswer.dailyGoodsAmountKey,
      items: [
        'cosmetics',
        'sanitation',
        'medicine',
        'kitchen-goods',
        'paper-stationery'
      ]
    },

    // 通信費、放送受信料を合わせた支出はどのくらいですか？
    // communication: String # 5k-less|5k10k|10k-20k|20k-30k|30k-more|unknown|average-per-capita
    // communication-delivery 通信・配送・放送サービス
    {
      category: 'communication-amount',
      key: otherAnswer.communicationAmountKey,
      items: ['postal-delivery', 'communication', 'broadcasting']
    },

    // 過去1年間の家電、家具などの大型な買い物の支出はどのくらいですか？
    // applianceFurniture: String # 50k-less|50k-100k|100k-200k|200k-300k||300k-400k|400k-more|unknown|average-per-capita
    // appliance-furniture 家電・家具
    {
      category: 'appliance-furniture-amount',
      key: otherAnswer.applianceFurnitureAmountKey,
      items: [
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
    // personal-care-other-services その他サービス
    // ceremony 冠婚葬祭
    // waste-repair-rental 廃棄物処理・修理・レンタル
    // welfare-education 医療・福祉・教育サービス
    {
      category: 'service-factor',
      key: otherAnswer.serviceFactorKey,
      items: [
        'housework',
        'washing',
        'haircare',
        'bath-spa',
        'finance-insurance',
        'other-services',
        'ceremony',
        'waste',
        'furniture-daily-goods-repair-rental',
        'clothes-repair-rental',
        'bags-jewelries-repair-rental',
        'electrical-appliances-repair-rental',
        'sports-culture-repair-rental',
        'sports-entertainment-repair-rental',
        'medical-care',
        'nursing',
        'caring',
        'formal-education',
        'informal-education'
      ]
    },

    // 趣味にかかるの物の支出はどのくらいですか？
    // hobbyGoods: String # 5000-less|5000-10000|10000-20000|20000-50000|50000-more|unknown
    // hobby-books 趣味用品・書籍・雑誌
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
        'books-magazines'
      ]
    },

    // 衣類、かばん、宝飾品、美容関連などの支出はどのくらいですか？
    // clothesBeauty: String # 5000-less|5000-10000|10000-20000|20000-50000|50000-more|unknown
    // clothes 衣類・宝飾品
    {
      category: 'clothes-beauty-factor',
      key: otherAnswer.clothesBeautyFactorKey,
      items: ['clothes-goods', 'bags-jewelries-goods']
    },

    // レジャー、スポーツへの支出はどのくらいですか？
    // leisureSports: String # 5000-less|5000-10000|10000-20000|20000-50000|50000-more|unknown
    // leisure-sports レジャー・スポーツ施設
    {
      category: 'leisure-sports-factor',
      key: otherAnswer.leisureSportsFactorKey,
      items: ['culture-leisure', 'entertainment-leisure', 'sports-leisure']
    },

    // 過去１年間の宿泊を伴う旅行にかかった費用はいくらくらいですか？
    // travel: String # 10000-less|20000-30000|30000-50000|50000-100000|100000-200000|200000-more|unknown
    // travel-hotel 旅行・宿泊
    {
      category: 'travel-factor',
      key: otherAnswer.travelFactorKey,
      items: ['hotel', 'travel']
    }
  ]

  for (let ans of answers) {
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
