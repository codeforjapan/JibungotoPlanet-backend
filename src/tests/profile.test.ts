import request from 'supertest'
// local mock の設定。テスト対象をimportする前に設定
process.env.TABLE_REGION = 'us-fake-1' // eslint-disable-line no-undef
process.env.ENV = 'dev' // eslint-disable-line no-undef
process.env.AWS_EXECUTION_ENV = 'local-mock' // eslint-disable-line no-undef
import app from '../../amplify/backend/function/profilea2218c7f/src/app' // テスト対象をインポート

describe('Test profile operation', () => {
  test('create profile', async () => {
    const resPost = await request(app)
      .post('/profiles')
      .send({
        gender: 'male',
        age: '20s',
        region: 'hokkaido'
      })
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    const profile = resPost.body.data

    expect(profile.gender).toBe('male')
    expect(profile.age).toBe('20s')
    expect(profile.region).toBe('hokkaido')
    expect(profile.actionIntensityRates.length).toBe(34)
  })
})
