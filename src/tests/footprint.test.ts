import request from 'supertest'
// local mock の設定。テスト対象をimportする前に設定
process.env.TABLE_REGION = 'ap-northeast-1' // eslint-disable-line no-undef
process.env.ENV = 'dev' // eslint-disable-line no-undef
process.env.LOCALSTACK_HOSTNAME = 'localhost' // eslint-disable-line no-undef
import app from '../../lib/lambda/footprint-app' // テスト対象をインポート

describe('Footprint', () => {
  test('Get', async () => {
    const res = await request(app)
      .get('/footprints/baseline/mobility/airplane/amount')
      .set('x-apigateway-event', 'null')
      .set('x-apigateway-context', 'null')

    expect(res.status).toBe(200)
    expect(res.body.dir).toBe('baseline')
    expect(res.body.domain).toBe('mobility')
    expect(res.body.item).toBe('airplane')
    expect(res.body.type).toBe('amount')
    expect(res.body.value).toBeCloseTo(1161.463556)
    expect(res.body.unit).toBe('km-passenger')
    expect(res.body.citation).toBe(
      'Koide et al. 2021. Environmental Research Letters 16 084001'
    )
  })
})
