import request from 'supertest'
// local mock の設定。テスト対象をimportする前に設定
process.env.TABLE_REGION = 'us-fake-1' // eslint-disable-line no-undef
process.env.ENV = 'dev' // eslint-disable-line no-undef
process.env.AWS_EXECUTION_ENV = 'local-mock' // eslint-disable-line no-undef
import app from '../../amplify/backend/function/profilea2218c7f/src/app' // テスト対象をインポート

describe('Test error cases', () => {
  test('create profile with unsupported foodAnswer', async () => {
    const resPost = await request(app)
      .post('/profiles')
      .send({
        estimate: true,
        foodAnswer: {
          foodIntakeFactorKey: 'modern',
          foodDirectWasteFactorKey: '2-3-per-week',
          foodLeftoverFactorKey: 'seldom',
          dishBeefFactorKey: 'never',
          dishPorkFactorKey: '1-less-per-month',
          dishChickenFactorKey: '2-3-per-month',
          dishSeafoodFactorKey: 'never',
          dairyFoodFactorKey: '1-2-less-per-week',
          alcoholFactorKey: '2-3-per-month',
          softDrinkSnackFactorKey: '3k-less',
          eatOutFactorKey: '5k-10k'
        }
      })
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    expect(resPost.status).toBe(400)
    console.log(JSON.stringify(resPost.body))

    const resPost2 = await request(app)
      .post('/profiles')
      .send({
        estimate: true,
        foodAnswer: {
          foodIntakeFactorKey: 'moderate',
          foodDirectWasteFactorKey: '2-3-per-week',
          foodLeftoverFactorKey: 'seldom',
          dishBeefFactorKey: 'never',
          dishPorkFactorKey: '1-less-per-month',
          dishChickenFactorKey: '2-3-per-month',
          dishSeafoodFactorKey: 'never',
          dairyFoodFactorKey: '1-2-less-per-week',
          alcoholFactorKey: '2-3-less-per-month',
          softDrinkSnackFactorKey: '3k-less',
          eatOutFactorKey: '5k-10k'
        }
      })
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    const profile = resPost2.body.data
    expect(resPost2.status).toBe(200)
    const resPut = await request(app)
      .put('/profiles/' + profile.id)
      .send({
        estimate: true,
        mobilityAnswer: {
          hasPrivateCar: 'Yes'
        }
      })
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    expect(resPut.status).toBe(400)
    console.log(JSON.stringify(resPut.body))
  })
})
