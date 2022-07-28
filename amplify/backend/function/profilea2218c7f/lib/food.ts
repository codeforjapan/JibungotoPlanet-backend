import { toBaseline, findBaseline, toEstimation } from './util'

const estimateFood = async (
  dynamodb,
  foodAnswer,
  footprintTableName,
  parameterTableName
) => {
  // foodのベースラインの取得
  const createAmount = (baselines, item) =>
    toEstimation(findBaseline(baselines, 'food', item, 'amount'))

  // const findIntensity = (baselines, item) => findBaseline(baselines, 'food', item, 'intensity')

  // foodAnswerのスキーマと取りうる値は以下を参照。
  // amplify/backend/api/JibungotoPlanetGql/schema.graphql
  const estimations = []

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
  const baselines = data.Items.map((item) => toBaseline(item))

  // 回答がない場合はベースラインのみ返す
  if (!foodAnswer) {
    return { baselines, estimations }
  }

  const foodIntakeFactor = await dynamodb
    .get({
      TableName: parameterTableName,
      Key: {
        category: 'food-intake-factor',
        key: foodAnswer.foodIntakeFactorKey
      }
    })
    .promise()

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

  if (foodAnswer.foodDirectWasteFactorKey && foodAnswer.foodLeftoverFactorKey) {
    const foodDirectWasteFactor = await dynamodb
      .get({
        TableName: parameterTableName,
        Key: {
          category: 'food-direct-waste-factor',
          key: foodAnswer.foodDirectWasteFactorKey
        }
      })
      .promise()

    const foodLeftoverFactor = await dynamodb
      .get({
        TableName: parameterTableName,
        Key: {
          category: 'food-leftover-factor',
          key: foodAnswer.foodLeftoverFactorKey
        }
      })
      .promise()

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
      (item) => item.key === 'leftover-per-food-waste'
    )
    const directWasteRatio = foodWastRatio.Items.find(
      (item) => item.key === 'direct-waste-per-food-waste'
    )
    const foodWasteRatio = foodWastRatio.Items.find(
      (item) => item.key === 'food-waste-per-food'
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
    if (foodAnswer.dairyFoodFactorKey) {
      const dairyFoodFactor = await dynamodb
        .get({
          TableName: parameterTableName,
          Key: {
            category: 'dairy-food-factor',
            key: foodAnswer.dairyFoodFactorKey
          }
        })
        .promise()

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
    if (foodAnswer.dishBeefFactorKey) {
      dishBeefFactor = await dynamodb
        .get({
          TableName: parameterTableName,
          Key: {
            category: 'dish-beef-factor',
            key: foodAnswer.dishBeefFactorKey
          }
        })
        .promise()

      estimationAmount.beef.value =
        estimationAmount.beef.value *
        dishBeefFactor.Item?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimations.push(estimationAmount.beef)
    }

    // 豚肉補正
    let dishPorkFactor = null
    if (foodAnswer.dishPorkFactorKey) {
      dishPorkFactor = await dynamodb
        .get({
          TableName: parameterTableName,
          Key: {
            category: 'dish-pork-factor',
            key: foodAnswer.dishPorkFactorKey
          }
        })
        .promise()

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
    if (foodAnswer.dishChickenFactorKey) {
      dishChickenFactor = await dynamodb
        .get({
          TableName: parameterTableName,
          Key: {
            category: 'dish-chicken-factor',
            key: foodAnswer.dishChickenFactorKey
          }
        })
        .promise()

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
    if (foodAnswer.dishSeafoodFactorKey) {
      const dishSeafoodFactor = await dynamodb
        .get({
          TableName: parameterTableName,
          Key: {
            category: 'dish-seafood-factor',
            key: foodAnswer.dishSeafoodFactorKey
          }
        })
        .promise()

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
    if (foodAnswer.alcoholFactorKey) {
      const alcoholFactor = await dynamodb
        .get({
          TableName: parameterTableName,
          Key: {
            category: 'alcohol-factor',
            key: foodAnswer.alcoholFactorKey
          }
        })
        .promise()

      estimationAmount.alcohol.value =
        estimationAmount.alcohol.value *
        alcoholFactor.Item?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimations.push(estimationAmount.alcohol)
    }

    // 菓子など補正
    if (foodAnswer.softDrinkSnackFactorKey) {
      const softDrinkSnackFactor = await dynamodb
        .get({
          TableName: parameterTableName,
          Key: {
            category: 'soft-drink-snack-factor',
            key: foodAnswer.softDrinkSnackFactorKey
          }
        })
        .promise()

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
  }

  // 外食部分の計算
  if (foodAnswer.eatOutFactorKey) {
    const eatOutFactor = await dynamodb
      .get({
        TableName: parameterTableName,
        Key: {
          category: 'eat-out-factor',
          key: foodAnswer.eatOutFactorKey
        }
      })
      .promise()
    estimationAmount.restaurant.value =
      estimationAmount.restaurant.value * eatOutFactor.Item?.value
    estimationAmount['bar-cafe'].value =
      estimationAmount['bar-cafe'].value * eatOutFactor.Item?.value
    estimations.push(estimationAmount.restaurant)
    estimations.push(estimationAmount['bar-cafe'])
  }

  console.log(JSON.stringify(estimations))
  return { baselines, estimations }
}

export { estimateFood }
