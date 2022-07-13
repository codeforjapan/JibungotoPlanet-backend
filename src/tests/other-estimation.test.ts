import request from 'supertest'
import xlsx from 'xlsx'
// local mock の設定。テスト対象をimportする前に設定
process.env.TABLE_REGION = 'us-fake-1' // eslint-disable-line no-undef
process.env.ENV = 'dev' // eslint-disable-line no-undef
process.env.AWS_EXECUTION_ENV = 'local-mock' // eslint-disable-line no-undef
import app from '../../amplify/backend/function/profilea2218c7f/src/app' // テスト対象をインポート
import { createTestCases } from './util'

describe('Other Estimation', () => {
  // テストケースを記載したExcel
  const workbook = xlsx.readFile('src/tests/other-estimation.test-cases.xlsx')
  const testCases = createTestCases(workbook)

  test('Estimate', async () => {
    // 最初にProfileの生成
    const resPost = await request(app)
      .post('/profiles')
      .send({})
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない
    expect(resPost.status).toBe(200)

    const id = resPost.body.data.id

    // 生成したProfileに対してテストケースを順番に適用
    for (const testCase of testCases) {
      const resPut = await request(app)
        .put('/profiles/' + id)
        .send(testCase.toRequest())
        .set('x-apigateway-event', null) // エラーを出さないおまじない
        .set('x-apigateway-context', null) // エラーを出さないおまじない

      expect(resPut.status).toBe(200)

      // 計算したestimationがexpectationとあっているを確認
      const estimations = resPut.body.data.estimations

      for (const estimation of estimations) {
        const exp = testCase.expectations.find(
          (e) =>
            e.domain === estimation.domain &&
            e.item === estimation.item &&
            e.type === estimation.type
        )
        console.log(
          'checking [' +
            testCase.case +
            ']: ' +
            exp.domain +
            '_' +
            exp.item +
            '_' +
            exp.type
        )
        expect(exp).not.toBeNull()
        expect(exp.estimated).toBeTruthy()
        expect(estimation.value).toBeCloseTo(exp.value)
      }

      // expectationがestimatedになっている場合、estimationに値があるかを確認
      for (const exp of testCase.expectations) {
        const estimation = estimations.find(
          (e) =>
            e.domain === exp.domain &&
            e.item === exp.item &&
            e.type === exp.type
        )
        expect(Boolean(estimation)).toBe(exp.estimated)
      }
    }
  })
})
