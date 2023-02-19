import { toBaseline, findBaseline, toEstimation } from './util'

const estimateOther = async (
  dynamodb: { get: (arg0: { TableName: any; Key: { category: any; key: any } }) => { (): any; new(): any; promise: { (): any; new(): any } }; query: (arg0: { TableName: any; KeyConditions: { dir_domain: { ComparisonOperator: string; AttributeValueList: string[] } } }) => { (): any; new(): any; promise: { (): any; new(): any } } },
  housingAnswer: { residentCount: number | null | undefined },
  otherAnswer: { dailyGoodsAmountKey: any; communicationAmountKey: any; applianceFurnitureAmountKey: any; serviceFactorKey: any; hobbyGoodsFactorKey: any; clothesBeautyFactorKey: any; leisureSportsFactorKey: any; travelFactorKey: any },
  footprintTableName: string,
  parameterTableName: string
) => {
  // foodのEstimationの取得
  const createAmount = (baselines: any, item: string) =>
    toEstimation(findBaseline(baselines, 'other', item, 'amount'))

  // parameterの取得
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
  const baselines = data.Items.map((item: any) => toBaseline(item))

  // 回答がない場合はベースラインのみ返す
  if (!otherAnswer) {
    return { baselines, estimations }
  }

  // 平均の居住人数を取得
  let residentCount = 1
  const familySize = await getData('family-size', 'unknown')
  if (familySize?.Item?.value) {
    residentCount = familySize.Item.value
  }

  if (
    housingAnswer &&
    housingAnswer.residentCount !== undefined &&
    housingAnswer.residentCount !== null
  ) {
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
    if (ans.key) {
      const data = await getData(ans.category, ans.key)
      let denominator: number | undefined = 1

      if (ans.base) {
        if (ans.key === 'unknown') {
          // 国平均の支出額（average-per-capita）が指定されていて、わからない、の回答の場合は
          // 国平均に対する比率は1倍。denominatorをundefinedにして計算に使わないようにする。
          denominator = undefined
        } else {
          const base = await getData(ans.category, ans.base)
          if (base?.Item?.value) {
            // 分母は国平均の支出額（average-per-capita） * 居住人数
            denominator = base.Item.value * residentCount
          }
        }
      }

      if (data?.Item?.value) {
        const coefficient = denominator ? data.Item.value / denominator : 1
        for (let item of ans.items) {
          const estimation = createAmount(baselines, item)
          estimation.value *= coefficient
          estimations.push(estimation)
        }
      }
    }
  }

  // wasteだけ特殊計算
  const wasteSet = new Set([
    'cooking-appliances',
    'heating-cooling-appliances',
    'other-appliances',
    'electronics',
    'clothes-goods',
    'bags-jewelries-goods',
    'culture-goods',
    'entertainment-goods',
    'sports-goods',
    'gardening-flower',
    'pet',
    'tobacco',
    'furniture',
    'covering',
    'cosmetics',
    'sanitation',
    'medicine',
    'kitchen-goods',
    'paper-stationery',
    'books-magazines'
  ])

  const isTarget = (t: { domain: any; item: any; type: any; value?: any; subdomain?: any; unit?: any; }) =>
    t.domain === 'other' && wasteSet.has(t.item) && t.type === 'amount'

  const targets = baselines.filter((b: { domain: any; item: any; type: any; value?: any; subdomain?: any; unit?: any; }) => isTarget(b))
  const results = new Map()

  let baselineSum = 0
  for (const baseline of targets) {
    const key = baseline.domain + '_' + baseline.item + '_' + baseline.type
    results.set(key, toEstimation(baseline))
    baselineSum += baseline.value
  }

  for (const estimation of estimations.filter((e) => isTarget(e))) {
    const key =
      estimation.domain + '_' + estimation.item + '_' + estimation.type
    results.set(key, estimation)
  }

  const estimationSum = Array.from(results.values()).reduce(
    (sum, res) => sum + res.value,
    0
  )

  const wasteEstimation = createAmount(baselines, 'waste')
  if (baselineSum !== 0) {
    wasteEstimation.value *= estimationSum / baselineSum
  }
  estimations.push(toEstimation(wasteEstimation))

  return { baselines, estimations }
}

export { estimateOther }
