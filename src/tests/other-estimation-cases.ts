export const otherEstimationCases = [
  {
    caseName: 'その他の質問のテストケース(1)',
    request: {
      otherAnswer: {
        dailyGoodsAmountKey: '5k-less',
        communicationAmountKey: '5k-less',
        applianceFurnitureAmountKey: '50k-less',
        serviceFactorKey: '5k-less',
        hobbyGoodsFactorKey: '5k-less',
        clothesBeautyFactorKey: '5k-less',
        leisureSportsFactorKey: '5k-less',
        travelFactorKey: '10k-less'
      }
    },
    expect: {
      estimations: Object.entries({
        hotel: 0,
        travel: 0,
        'culture-leisure': 0,
        'entertainment-leisure': 0,
        'sports-leisure': 0,
        'furniture-daily-goods-repair-rental': 0,
        'clothes-repair-rental': 0,
        'bags-jewelries-repair-rental': 0,
        'electrical-appliances-repair-rental': 0,
        'sports-culture-repair-rental': 0,
        'sports-entertainment-repair-rental': 0,
        housework: 0,
        washing: 0,
        haircare: 0,
        'bath-spa': 0,
        'postal-delivery': 0,
        communication: 0,
        broadcasting: 0,
        ceremony: 0,
        'medical-care': 0,
        nursing: 0,
        caring: 0,
        'formal-education': 0,
        'informal-education': 0,
        'finance-insurance': 0,
        'other-services': 0
      }).map((e) => ({
        domain: 'other',
        item: e[0],
        type: 'amount',
        value: e[1],
        unit: '000JPY'
      }))
    }
  }
]
