import { toBaseline, findBaseline, toEstimation } from './util'

const estimateFood = async (
  dynamodb: { get: (arg0: { TableName: any; Key: { category: any; key: any } }) => { (): any; new(): any; promise: { (): any; new(): any } }; query: (arg0: { TableName: any; KeyConditions: { dir_domain: { ComparisonOperator: string; AttributeValueList: string[] } } | { category: { ComparisonOperator: string; AttributeValueList: string[] } } }) => { (): any; new(): any; promise: { (): any; new(): any } } },
  foodAnswer: { foodIntakeFactorKey: any; foodDirectWasteFactorKey: any; foodLeftoverFactorKey: any; dairyFoodFactorKey: any; dishBeefFactorKey: any; dishPorkFactorKey: any; dishChickenFactorKey: any; dishSeafoodFactorKey: any; alcoholFactorKey: any; softDrinkSnackFactorKey: any; eatOutFactorKey: any },
  footprintTableName: string,
  parameterTableName: string
) => {
  const getData = async (category: string, key: any) =>
    await dynamodb
      .get({
        TableName: parameterTableName,
        Key: {
          category: category,
          key: key
        }
      })
      .promise()

  // foodのベースラインの取得
  const createAmount = (baselines: any, item: string) =>
    toEstimation(findBaseline(baselines, 'food', item, 'amount'))
  const createIntensity = (item: string) =>
    toEstimation(findBaseline(baselines, 'food', item, 'intensity'))
  const getCategoryBaseTotal = (item: string) =>
    findBaseline(baselines, 'food', item, 'amount').value *
    findBaseline(baselines, 'food', item, 'intensity').value
  const getCategoryCustomTotal = (item: string, value: number) =>
    value * findBaseline(baselines, 'food', item, 'intensity').value

  const estimations: { domain: any; item: any; type: any; value: any; subdomain: any; unit: any; }[] = []

  // ベースラインのフットプリントを取得
  const params = {
    TableName: footprintTableName,
    KeyConditions: {
      dir_domain: {
        ComparisonOperator: 'EQ',
        AttributeValueList: ['baseline_food']
      }
    }
  }

  const data = await dynamodb.query(params).promise()
  const baselines = data.Items.map((item: any) => toBaseline(item))

  // 回答がない場合はベースラインのみ返す
  if (!foodAnswer) {
    return { baselines, estimations }
  }

  const foodIntakeFactor = await getData(
    'food-intake-factor',
    foodAnswer?.foodIntakeFactorKey || 'unknown'
  )

  const estimationAmount = {
    rice: createAmount(baselines, 'rice'),
    'bread-flour': createAmount(baselines, 'bread-flour'),
    noodle: createAmount(baselines, 'noodle'),
    potatoes: createAmount(baselines, 'potatoes'),
    vegetables: createAmount(baselines, 'vegetables'),
    'processed-vegetables': createAmount(baselines, 'processed-vegetables'),
    beans: createAmount(baselines, 'beans'),
    milk: createAmount(baselines, 'milk'),
    'other-dairy': createAmount(baselines, 'other-dairy'),
    eggs: createAmount(baselines, 'eggs'),
    beef: createAmount(baselines, 'beef'),
    pork: createAmount(baselines, 'pork'),
    chicken: createAmount(baselines, 'chicken'),
    'other-meat': createAmount(baselines, 'other-meat'),
    'processed-meat': createAmount(baselines, 'processed-meat'),
    fish: createAmount(baselines, 'fish'),
    'processed-fish': createAmount(baselines, 'processed-fish'),
    fruits: createAmount(baselines, 'fruits'),
    oil: createAmount(baselines, 'oil'),
    seasoning: createAmount(baselines, 'seasoning'),
    'sweets-snack': createAmount(baselines, 'sweets-snack'),
    'ready-meal': createAmount(baselines, 'ready-meal'),
    alcohol: createAmount(baselines, 'alcohol'),
    'coffee-tea': createAmount(baselines, 'coffee-tea'),
    'cold-drink': createAmount(baselines, 'cold-drink'),
    restaurant: createAmount(baselines, 'restaurant'),
    'bar-cafe': createAmount(baselines, 'bar-cafe')
  }

  if (
    foodAnswer?.foodDirectWasteFactorKey &&
    foodAnswer?.foodLeftoverFactorKey
  ) {
    const foodDirectWasteFactor = await getData(
      'food-direct-waste-factor',
      foodAnswer.foodDirectWasteFactorKey
    )

    const foodLeftoverFactor = await getData(
      'food-leftover-factor',
      foodAnswer.foodLeftoverFactorKey
    )

    const foodWastRatio = await dynamodb
      .query({
        TableName: parameterTableName,
        KeyConditions: {
          category: {
            ComparisonOperator: 'EQ',
            AttributeValueList: ['food-waste-share']
          }
        }
      })
      .promise()

    const leftoverRatio = foodWastRatio.Items.find(
      (item: { key: string; }) => item.key === 'leftover-per-food-waste'
    )
    const directWasteRatio = foodWastRatio.Items.find(
      (item: { key: string; }) => item.key === 'direct-waste-per-food-waste'
    )
    const foodWasteRatio = foodWastRatio.Items.find(
      (item: { key: string; }) => item.key === 'food-waste-per-food'
    )

    const foodLossAverageRatio =
      foodDirectWasteFactor.Item?.value * directWasteRatio.value +
      foodLeftoverFactor.Item?.value * leftoverRatio.value

    // 全体に影響する割合
    // 食品ロスを考慮した食材購入量の平均に対する比率
    const foodPurchaseAmountConsideringFoodLossRatio =
      (1 + foodLossAverageRatio * foodWasteRatio.value) /
      (1 + foodWasteRatio.value)

    estimationAmount.rice.value =
      estimationAmount.rice.value *
      foodIntakeFactor.Item?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimationAmount['bread-flour'].value =
      estimationAmount['bread-flour'].value *
      foodIntakeFactor.Item?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimationAmount.noodle.value =
      estimationAmount.noodle.value *
      foodIntakeFactor.Item?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimationAmount.potatoes.value =
      estimationAmount.potatoes.value *
      foodIntakeFactor.Item?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimationAmount.vegetables.value =
      estimationAmount.vegetables.value *
      foodIntakeFactor.Item?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimationAmount['processed-vegetables'].value =
      estimationAmount['processed-vegetables'].value *
      foodIntakeFactor.Item?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimationAmount.beans.value =
      estimationAmount.beans.value *
      foodIntakeFactor.Item?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimationAmount.fruits.value =
      estimationAmount.fruits.value *
      foodIntakeFactor.Item?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimationAmount.oil.value =
      estimationAmount.oil.value *
      foodIntakeFactor.Item?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimationAmount.seasoning.value =
      estimationAmount.seasoning.value *
      foodIntakeFactor.Item?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimationAmount['ready-meal'].value =
      estimationAmount['ready-meal'].value *
      foodIntakeFactor.Item?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimations.push(estimationAmount.rice)
    estimations.push(estimationAmount['bread-flour'])
    estimations.push(estimationAmount.noodle)
    estimations.push(estimationAmount.potatoes)
    estimations.push(estimationAmount.vegetables)
    estimations.push(estimationAmount['processed-vegetables'])
    estimations.push(estimationAmount.beans)
    estimations.push(estimationAmount.fruits)
    estimations.push(estimationAmount.oil)
    estimations.push(estimationAmount.seasoning)
    estimations.push(estimationAmount['ready-meal'])

    //
    // 答えに従ってestimationを計算
    //

    // 乳製品補正
    if (foodAnswer?.dairyFoodFactorKey) {
      const dairyFoodFactor = await getData(
        'dairy-food-factor',
        foodAnswer.dairyFoodFactorKey
      )

      estimationAmount.milk.value =
        estimationAmount.milk.value *
        dairyFoodFactor.Item?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimationAmount['other-dairy'].value =
        estimationAmount['other-dairy'].value *
        dairyFoodFactor.Item?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimationAmount.eggs.value =
        estimationAmount.eggs.value *
        dairyFoodFactor.Item?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimations.push(estimationAmount.milk)
      estimations.push(estimationAmount['other-dairy'])
      estimations.push(estimationAmount.eggs)
    }

    // 牛肉補正
    let dishBeefFactor = null
    if (foodAnswer?.dishBeefFactorKey) {
      dishBeefFactor = await getData(
        'dish-beef-factor',
        foodAnswer.dishBeefFactorKey
      )

      estimationAmount.beef.value =
        estimationAmount.beef.value *
        dishBeefFactor.Item?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimations.push(estimationAmount.beef)
    }

    // 豚肉補正
    let dishPorkFactor = null
    if (foodAnswer?.dishPorkFactorKey) {
      dishPorkFactor = await getData(
        'dish-pork-factor',
        foodAnswer.dishPorkFactorKey
      )

      estimationAmount.pork.value =
        estimationAmount.pork.value *
        dishPorkFactor.Item?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimationAmount['other-meat'].value =
        estimationAmount['other-meat'].value *
        dishPorkFactor.Item?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimations.push(estimationAmount.pork)
      estimations.push(estimationAmount['other-meat'])
    }

    // 鶏肉補正
    let dishChickenFactor = null
    if (foodAnswer?.dishChickenFactorKey) {
      dishChickenFactor = await getData(
        'dish-chicken-factor',
        foodAnswer.dishChickenFactorKey
      )

      estimationAmount.chicken.value =
        estimationAmount.chicken.value *
        dishChickenFactor.Item?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimations.push(estimationAmount.chicken)
    }

    // 加工肉補正
    if (dishBeefFactor && dishPorkFactor && dishChickenFactor) {
      estimationAmount['processed-meat'].value =
        (estimationAmount['processed-meat'].value *
          (estimationAmount.beef.value +
            estimationAmount.pork.value +
            estimationAmount['other-meat'].value +
            estimationAmount.chicken.value)) /
        (createAmount(baselines, 'beef').value +
          createAmount(baselines, 'pork').value +
          createAmount(baselines, 'other-meat').value +
          createAmount(baselines, 'chicken').value)
      estimations.push(estimationAmount['processed-meat'])
    }

    // 魚補正
    if (foodAnswer?.dishSeafoodFactorKey) {
      const dishSeafoodFactor = await getData(
        'dish-seafood-factor',
        foodAnswer.dishSeafoodFactorKey
      )

      estimationAmount.fish.value =
        estimationAmount.fish.value *
        dishSeafoodFactor.Item?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimationAmount['processed-fish'].value =
        estimationAmount['processed-fish'].value *
        dishSeafoodFactor.Item?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimations.push(estimationAmount.fish)
      estimations.push(estimationAmount['processed-fish'])
    }

    // アルコール補正
    if (foodAnswer?.alcoholFactorKey) {
      const alcoholFactor = await getData(
        'alcohol-factor',
        foodAnswer.alcoholFactorKey
      )

      estimationAmount.alcohol.value =
        estimationAmount.alcohol.value *
        alcoholFactor.Item?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimations.push(estimationAmount.alcohol)
    }

    // 菓子など補正
    if (foodAnswer?.softDrinkSnackFactorKey) {
      const softDrinkSnackFactor = await getData(
        'soft-drink-snack-factor',
        foodAnswer.softDrinkSnackFactorKey
      )

      estimationAmount['sweets-snack'].value =
        estimationAmount['sweets-snack'].value *
        softDrinkSnackFactor.Item?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimationAmount['coffee-tea'].value =
        estimationAmount['coffee-tea'].value *
        softDrinkSnackFactor.Item?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimationAmount['cold-drink'].value =
        estimationAmount['cold-drink'].value *
        softDrinkSnackFactor.Item?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimations.push(estimationAmount['sweets-snack'])
      estimations.push(estimationAmount['coffee-tea'])
      estimations.push(estimationAmount['cold-drink'])
    }

    // //ready-meal intensity
    const beforeReadyMealKeyArray = [
      'rice',
      'bread-flour',
      'noodle',
      'potatoes',
      'vegetables',
      'processed-vegetables',
      'beans',
      'milk',
      'other-dairy',
      'eggs',
      'beef',
      'pork',
      'chicken',
      'other-meat',
      'processed-meat',
      'fish',
      'processed-fish',
      'fruits',
      'oil',
      'seasoning',
      'sweets-snack'
    ]

    const readyMealIntensity = createIntensity('ready-meal')
    let currentTotalAmount = beforeReadyMealKeyArray.reduce(
      // @ts-ignore
      (res, key) => res + estimationAmount[key].value,
      0
    )
    let baseTotalAmount = beforeReadyMealKeyArray.reduce(
      (res, key) => res + findBaseline(baselines, 'food', key, 'amount').value,
      0
    )
    readyMealIntensity.value =
      (readyMealIntensity.value *
        (beforeReadyMealKeyArray.reduce(
            (res, key) =>
              // @ts-ignore
              res + getCategoryCustomTotal(key, estimationAmount[key].value),
            0
          ) /
          currentTotalAmount)) /
      (beforeReadyMealKeyArray.reduce(
          (res, key) => res + getCategoryBaseTotal(key),
          0
        ) /
        baseTotalAmount)
    estimations.push(readyMealIntensity)

    // 外食部分の計算
    if (foodAnswer?.eatOutFactorKey) {
      const eatOutFactor = await getData(
        'eat-out-factor',
        foodAnswer.eatOutFactorKey
      )
      estimationAmount.restaurant.value =
        estimationAmount.restaurant.value * eatOutFactor.Item?.value
      estimationAmount['bar-cafe'].value =
        estimationAmount['bar-cafe'].value * eatOutFactor.Item?.value
      estimations.push(estimationAmount.restaurant)
      estimations.push(estimationAmount['bar-cafe'])

      //eatOut intensity
      const EatOutArray = [
        'rice',
        'bread-flour',
        'noodle',
        'potatoes',
        'vegetables',
        'processed-vegetables',
        'beans',
        'milk',
        'other-dairy',
        'eggs',
        'beef',
        'pork',
        'chicken',
        'other-meat',
        'processed-meat',
        'fish',
        'processed-fish',
        'fruits',
        'oil',
        'seasoning',
        'sweets-snack',
        'ready-meal',
        'alcohol',
        'coffee-tea',
        'cold-drink'
      ]
      currentTotalAmount = EatOutArray.reduce(
        // @ts-ignore
        (res, key) => res + estimationAmount[key].value,
        0
      )
      baseTotalAmount = EatOutArray.reduce(
        (res, key) =>
          res + findBaseline(baselines, 'food', key, 'amount').value,
        0
      )
      const eatOutIntensityResult =
        EatOutArray.reduce((res, key) => {
          if (key !== 'ready-meal') {
            return (
              // @ts-ignore
              res + getCategoryCustomTotal(key, estimationAmount[key].value)
            )
          } else {
            return res + estimationAmount[key].value * readyMealIntensity.value
          }
        }, 0) /
        currentTotalAmount /
        (EatOutArray.reduce((res, key) => res + getCategoryBaseTotal(key), 0) /
          baseTotalAmount)
      const restaurantIntensity = createIntensity('restaurant')
      const barCafeIntensity = createIntensity('bar-cafe')
      restaurantIntensity.value =
        restaurantIntensity.value * eatOutIntensityResult
      barCafeIntensity.value = barCafeIntensity.value * eatOutIntensityResult
      estimations.push(restaurantIntensity)
      estimations.push(barCafeIntensity)
    }
  }

  // console.log(JSON.stringify(estimations))
  return { baselines, estimations }
}

export { estimateFood }
