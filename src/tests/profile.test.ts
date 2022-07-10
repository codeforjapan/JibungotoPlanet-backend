import request from 'supertest'
// local mock の設定。テスト対象をimportする前に設定
process.env.TABLE_REGION = 'us-fake-1' // eslint-disable-line no-undef
process.env.ENV = 'dev' // eslint-disable-line no-undef
process.env.AWS_EXECUTION_ENV = 'local-mock' // eslint-disable-line no-undef
import app from '../../amplify/backend/function/profilea2218c7f/src/app' // テスト対象をインポート

describe('Profile', () => {
  test('Get profile', async () => {
    const res = await request(app)
      .get('/profiles/4063560e-56b1-4105-af52-a26d739a91d7')
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    console.log(res.body.id + ':' + res.body.shareId)
    expect(res.status).toBe(200)
  })

  test('Post profile', async () => {
    const res = await request(app)
      .post('/profiles')
      .send({})
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    console.log(res.body.data.id + ':' + res.body.data.shareId)
    expect(res.status).toBe(200)
  })
})
