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
    .query({
      TableName: parameterTableName,
      KeyConditions: {
        category: {
          ComparisonOperator: 'EQ',
          AttributeValueList: ['food-intake-factor']
        },
        key: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [foodAnswer.foodIntakeFactorKey]
        }
      }
    })
    .promise()

  const estimationAmount = {
    rice: findAmount(baselines, 'rice'),
    'bread-flour': findAmount(baselines, 'bread-flour'),
    noodle: findAmount(baselines, 'noodle'),
    potatoes: findAmount(baselines, 'potatoes'),
    vegetables: findAmount(baselines, 'vegetables'),
    'processed-vegetables': findAmount(baselines, 'processed-vegetables'),
    beans: findAmount(baselines, 'beans'),
    milk: findAmount(baselines, 'milk'),
    'other-dairy': findAmount(baselines, 'other-dairy'),
    eggs: findAmount(baselines, 'eggs'),
    beef: findAmount(baselines, 'beef'),
    pork: findAmount(baselines, 'pork'),
    chicken: findAmount(baselines, 'chicken'),
    'other-meat': findAmount(baselines, 'other-meat'),
    'processed-meat': findAmount(baselines, 'processed-meat'),
    fish: findAmount(baselines, 'fish'),
    'processed-fish': findAmount(baselines, 'processed-fish'),
    fruits: findAmount(baselines, 'fruits'),
    oil: findAmount(baselines, 'oil'),
    seasoning: findAmount(baselines, 'seasoning'),
    'sweets-snack': findAmount(baselines, 'sweets-snack'),
    'ready-meal': findAmount(baselines, 'ready-meal'),
    alcohol: findAmount(baselines, 'alcohol'),
    'coffee-tea': findAmount(baselines, 'coffee-tea'),
    'cold-drink': findAmount(baselines, 'cold-drink')
  }

  if (foodAnswer.foodDirectWasteFactorKey && foodAnswer.foodLeftoverFactorKey) {
    const foodDirectWasteFactor = await dynamodb
      .query({
        TableName: parameterTableName,
        KeyConditions: {
          category: {
            ComparisonOperator: 'EQ',
            AttributeValueList: ['food-direct-waste-factor']
          },
          key: {
            ComparisonOperator: 'EQ',
            AttributeValueList: [foodAnswer.foodDirectWasteFactorKey]
          }
        }
      })
      .promise()

    const foodLeftoverFactor = await dynamodb
      .query({
        TableName: parameterTableName,
        KeyConditions: {
          category: {
            ComparisonOperator: 'EQ',
            AttributeValueList: ['food-leftover-factor']
          },
          key: {
            ComparisonOperator: 'EQ',
            AttributeValueList: [foodAnswer.foodLeftoverFactorKey]
          }
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
      foodDirectWasteFactor.Items[0]?.value * directWasteRatio.value +
      foodLeftoverFactor.Items[0]?.value * leftoverRatio.value

    // 全体に影響する割合
    // 食品ロスを考慮した食材購入量の平均に対する比率
    const foodPurchaseAmountConsideringFoodLossRatio =
      (1 + foodLossAverageRatio * foodWasteRatio.value) /
      (1 + foodWasteRatio.value)

    estimationAmount.rice.value =
      estimationAmount.rice.value *
      foodIntakeFactor.Items[0]?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimationAmount['bread-flour'].value =
      estimationAmount['bread-flour'].value *
      foodIntakeFactor.Items[0]?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimationAmount.noodle.value =
      estimationAmount.noodle.value *
      foodIntakeFactor.Items[0]?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimationAmount.potatoes.value =
      estimationAmount.potatoes.value *
      foodIntakeFactor.Items[0]?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimationAmount.vegetables.value =
      estimationAmount.vegetables.value *
      foodIntakeFactor.Items[0]?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimationAmount['processed-vegetables'].value =
      estimationAmount['processed-vegetables'].value *
      foodIntakeFactor.Items[0]?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimationAmount.beans.value =
      estimationAmount.beans.value *
      foodIntakeFactor.Items[0]?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimationAmount.fruits.value =
      estimationAmount.fruits.value *
      foodIntakeFactor.Items[0]?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimationAmount.oil.value =
      estimationAmount.oil.value *
      foodIntakeFactor.Items[0]?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimationAmount.seasoning.value =
      estimationAmount.seasoning.value *
      foodIntakeFactor.Items[0]?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimationAmount['ready-meal'].value =
      estimationAmount['ready-meal'].value *
      foodIntakeFactor.Items[0]?.value *
      foodPurchaseAmountConsideringFoodLossRatio
    estimations.push(toEstimation(estimationAmount.rice))
    estimations.push(toEstimation(estimationAmount['bread-flour']))
    estimations.push(toEstimation(estimationAmount.noodle))
    estimations.push(toEstimation(estimationAmount.potatoes))
    estimations.push(toEstimation(estimationAmount.vegetables))
    estimations.push(toEstimation(estimationAmount['processed-vegetables']))
    estimations.push(toEstimation(estimationAmount.beans))
    estimations.push(toEstimation(estimationAmount.fruits))
    estimations.push(toEstimation(estimationAmount.oil))
    estimations.push(toEstimation(estimationAmount.seasoning))
    estimations.push(toEstimation(estimationAmount['ready-meal']))

    //
    // 答えに従ってestimationを計算
    //

    // 乳製品補正
    if (foodAnswer.dairyFoodFactorKey) {
      const dairyFoodFactor = await dynamodb
        .query({
          TableName: parameterTableName,
          KeyConditions: {
            category: {
              ComparisonOperator: 'EQ',
              AttributeValueList: ['dairy-food-factor']
            },
            key: {
              ComparisonOperator: 'EQ',
              AttributeValueList: [foodAnswer.dairyFoodFactorKey]
            }
          }
        })
        .promise()

      estimationAmount.milk.value =
        estimationAmount.milk.value *
        dairyFoodFactor.Items[0]?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimationAmount['other-dairy'].value =
        estimationAmount['other-dairy'].value *
        dairyFoodFactor.Items[0]?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimationAmount.eggs.value =
        estimationAmount.eggs.value *
        dairyFoodFactor.Items[0]?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimations.push(toEstimation(estimationAmount.milk))
      estimations.push(toEstimation(estimationAmount['other-dairy']))
      estimations.push(toEstimation(estimationAmount.eggs))
    }

    // 牛肉補正
    let dishBeefFactor = null
    if (foodAnswer.dishBeefFactorKey) {
      dishBeefFactor = await dynamodb
        .query({
          TableName: parameterTableName,
          KeyConditions: {
            category: {
              ComparisonOperator: 'EQ',
              AttributeValueList: ['dish-beef-factor']
            },
            key: {
              ComparisonOperator: 'EQ',
              AttributeValueList: [foodAnswer.dishBeefFactorKey]
            }
          }
        })
        .promise()

      estimationAmount.beef.value =
        estimationAmount.beef.value *
        dishBeefFactor.Items[0]?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimations.push(toEstimation(estimationAmount.beef))
    }

    // 牛肉補正
    let dishPorkFactor = null
    if (foodAnswer.dishPorkFactorKey) {
      dishPorkFactor = await dynamodb
        .query({
          TableName: parameterTableName,
          KeyConditions: {
            category: {
              ComparisonOperator: 'EQ',
              AttributeValueList: ['dish-pork-factor']
            },
            key: {
              ComparisonOperator: 'EQ',
              AttributeValueList: [foodAnswer.dishPorkFactorKey]
            }
          }
        })
        .promise()

      estimationAmount.pork.value =
        estimationAmount.pork.value *
        dishPorkFactor.Items[0]?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimationAmount['other-meat'].value =
        estimationAmount['other-meat'].value *
        dishPorkFactor.Items[0]?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimations.push(toEstimation(estimationAmount.pork))
      estimations.push(toEstimation(estimationAmount['other-meat']))
    }

    // 鶏肉補正
    let dishChickenFactor = null
    if (foodAnswer.dishChickenFactorKey) {
      dishChickenFactor = await dynamodb
        .query({
          TableName: parameterTableName,
          KeyConditions: {
            category: {
              ComparisonOperator: 'EQ',
              AttributeValueList: ['dish-chicken-factor']
            },
            key: {
              ComparisonOperator: 'EQ',
              AttributeValueList: [foodAnswer.dishChickenFactorKey]
            }
          }
        })
        .promise()

      estimationAmount.chicken.value =
        estimationAmount.chicken.value *
        dishChickenFactor.Items[0]?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimations.push(toEstimation(estimationAmount.chicken))
    }

    // 加工肉補正
    if (dishBeefFactor && dishPorkFactor && dishChickenFactor) {
      estimationAmount['processed-meat'].value =
        (estimationAmount['processed-meat'].value *
          (estimationAmount.beef.value +
            estimationAmount.pork.value +
            estimationAmount.chicken.value)) /
        (findAmount(baselines, 'beef').value +
          findAmount(baselines, 'pork').value +
          findAmount(baselines, 'chicken').value)
      estimations.push(toEstimation(estimationAmount['processed-meat']))
    }

    // 魚補正
    if (foodAnswer.dishSeafoodFactorKey) {
      const dishSeafoodFactor = await dynamodb
        .query({
          TableName: parameterTableName,
          KeyConditions: {
            category: {
              ComparisonOperator: 'EQ',
              AttributeValueList: ['dish-seafood-factor']
            },
            key: {
              ComparisonOperator: 'EQ',
              AttributeValueList: [foodAnswer.dishSeafoodFactorKey]
            }
          }
        })
        .promise()

      estimationAmount.fish.value =
        estimationAmount.pork.value *
        dishSeafoodFactor.Items[0]?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimationAmount['processed-fish'].value =
        estimationAmount['processed-fish'].value *
        dishSeafoodFactor.Items[0]?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimations.push(toEstimation(estimationAmount.fish))
      estimations.push(toEstimation(estimationAmount['processed-fish']))
    }

    // アルコール補正
    if (foodAnswer.alcoholFactorKey) {
      const alcoholFactor = await dynamodb
        .query({
          TableName: parameterTableName,
          KeyConditions: {
            category: {
              ComparisonOperator: 'EQ',
              AttributeValueList: ['alcohol-factor']
            },
            key: {
              ComparisonOperator: 'EQ',
              AttributeValueList: [foodAnswer.alcoholFactorKey]
            }
          }
        })
        .promise()

      estimationAmount.alcohol.value =
        estimationAmount.alcohol.value *
        alcoholFactor.Items[0]?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimations.push(toEstimation(estimationAmount.alcohol))
    }

    // アルコール補正
    if (foodAnswer.alcoholFactorKey) {
      const alcoholFactor = await dynamodb
        .query({
          TableName: parameterTableName,
          KeyConditions: {
            category: {
              ComparisonOperator: 'EQ',
              AttributeValueList: ['alcohol-factor']
            },
            key: {
              ComparisonOperator: 'EQ',
              AttributeValueList: [foodAnswer.alcoholFactorKey]
            }
          }
        })
        .promise()

      estimationAmount.alcohol.value =
        estimationAmount.alcohol.value *
        alcoholFactor.Items[0]?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimations.push(toEstimation(estimationAmount.alcohol))
    }

    // 菓子など補正
    if (foodAnswer.softDrinkSnackFactorKey) {
      const softDrinkSnackFactor = await dynamodb
        .query({
          TableName: parameterTableName,
          KeyConditions: {
            category: {
              ComparisonOperator: 'EQ',
              AttributeValueList: ['soft-drink-snack-factor']
            },
            key: {
              ComparisonOperator: 'EQ',
              AttributeValueList: [foodAnswer.softDrinkSnackFactorKey]
            }
          }
        })
        .promise()

      estimationAmount['sweets-snack'].value =
        estimationAmount['sweets-snack'].value *
        softDrinkSnackFactor.Items[0]?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimationAmount['coffee-tea'].value =
        estimationAmount['coffee-tea'].value *
        softDrinkSnackFactor.Items[0]?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimationAmount['cold-drink'].value =
        estimationAmount['cold-drink'].value *
        softDrinkSnackFactor.Items[0]?.value *
        foodPurchaseAmountConsideringFoodLossRatio
      estimations.push(toEstimation(estimationAmount['sweets-snack']))
      estimations.push(toEstimation(estimationAmount['coffee-tea']))
      estimations.push(toEstimation(estimationAmount['cold-drink']))
    }
  }

  console.log(JSON.stringify(estimations))
  return { baselines, estimations }
}

export { estimateFood }
