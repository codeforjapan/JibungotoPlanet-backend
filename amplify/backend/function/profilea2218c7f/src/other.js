const { toComponent, findComponent, toEstimation } = require('./util')

module.exports.estimateOther = async (
  dynamodb,
  otherAnswer,
  footprintTableName,
  parameterTableName
) => {
  // foodのベースラインの取得
  const findAmount = (baselines, item) =>
    findComponent(baselines, 'other', item, 'amount')
  const findIntensity = (baselines, item) =>
    findComponent(baselines, 'other', item, 'intensity')

  // otherAnswerのスキーマと取りうる値は以下を参照。
  // amplify/backend/api/JibungotoPlanetGql/schema.graphql
  let estimations = []

  // ベースラインのフットプリントを取得
  let params = {
    TableName: footprintTableName,
    KeyConditions: {
      dirAndDomain: {
        ComparisonOperator: 'EQ',
        AttributeValueList: ['baseline_other']
      }
    }
  }

  let data = await dynamodb.query(params).promise()
  const baselines = data.Items.map((item) => toComponent(item))

  // 回答がない場合はベースラインのみ返す
  if (!otherAnswer) {
    return { baselines, estimations }
  }

  const answers = [
    // 日用消耗品の支出はどのくらいですか？
    // dailyGoods: String # 5000-less|5000-10000|10000-20000|20000-30000|30000-more|unknown|average-per-capita
    // daily-goods-medicine 日用品・化粧品・医薬品
    {
      category: 'clothes-beauty-factor',
      key: otherAnswer.dailyGoods,
      items: [
        'cosmetics',
        'sanitation',
        'medicine',
        'kitchengoods',
        'paper-stationaries' // stationeriesのタイポ?
      ]
    },

    // 通信費、放送受信料を合わせた支出はどのくらいですか？
    // communication: String # 5000-less|5000-10000|10000-20000|20000-30000|30000-more|unknown|average-per-capita
    // communication-delivery 通信・配送・放送サービス
    {
      category: 'communication-amount',
      key: otherAnswer.communication,
      items: ['postal-delivery', 'communication', 'broadcasting']
    },

    // 過去1年間の家電、家具などの大型な買い物の支出はどのくらいですか？
    // applianceFurniture: String # 50000-less|50000-100000|100000-200000|200000-300000||300000-400000|400000-more|unknown|average-per-capita
    // appliance-furniture 家電・家具
    {
      category: 'appliance-furniture-amount',
      key: otherAnswer.applianceFurniture,
      items: [
        'cookingappliances',
        'heatingcoolingappliances',
        'otherappliances',
        'electronics',
        'furniture',
        'covering'
      ]
    },

    //  医療、福祉、教育、塾などの習い事の支出はどのくらいですか？
    // service: String # 5000-less|5000-10000|10000-20000|20000-50000|50000-more|unknown
    // personalcare-other-services その他サービス
    // ceremony 冠婚葬祭
    // waste-repair-rental 廃棄物処理・修理・レンタル
    // welfare-education	医療・福祉・教育サービス
    {
      category: 'service-factor',
      key: otherAnswer.service,
      items: [
        'housework',
        'washing',
        'haircare',
        'bath-spa',
        'finance-insurance',
        'otherservices',
        'ceremony',
        'waste',
        'furniture-dailygoods-repair-rental',
        'clothes-repair-rental',
        'bags-jewelries-repair-rental',
        'electrics-appliances-repair-rental',
        'sports-culture-repair-rental',
        'sports-entertainment-repair-rental',
        'medicalcare',
        'nursing',
        'caring',
        'formaleducation',
        'informaleducation'
      ]
    },

    // 趣味にかかるの物の支出はどのくらいですか？
    // hobbyGoods: String # 5000-less|5000-10000|10000-20000|20000-50000|50000-more|unknown
    // hobby-books 趣味用品・書籍・雑誌
    {
      category: 'hobby-goods-factor',
      key: otherAnswer.hobbyGoods,
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
      key: otherAnswer.clothesBeauty,
      items: ['clothes-goods', 'bags-jewelries-goods']
    },

    // レジャー、スポーツへの支出はどのくらいですか？
    // leisureSports: String # 5000-less|5000-10000|10000-20000|20000-50000|50000-more|unknown
    // leisure-sports レジャー・スポーツ施設
    {
      category: 'leisure-sports-factor',
      key: otherAnswer.leisureSports,
      items: ['culture-leisure', 'entertainment-leisure', 'sports-leisure']
    },

    // 過去１年間の宿泊を伴う旅行にかかった費用はいくらくらいですか？
    //travel: String # 10000-less|20000-30000|30000-50000|50000-100000|100000-200000|200000-more|unknown
    // travel-hotel 旅行・宿泊
    {
      category: 'travel-factor',
      key: otherAnswer.travel,
      items: ['hotel', 'travel']
    }
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
