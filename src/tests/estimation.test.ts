import request from 'supertest'
import xlsx from 'xlsx'
// local mock の設定。テスト対象をimportする前に設定
process.env.TABLE_REGION = 'us-fake-1' // eslint-disable-line no-undef
process.env.ENV = 'dev' // eslint-disable-line no-undef
process.env.AWS_EXECUTION_ENV = 'local-mock' // eslint-disable-line no-undef
import app from '../../amplify/backend/function/profilea2218c7f/src/app' // テスト対象をインポート
import footprintApp from '../../amplify/backend/function/footprintf523f2c8/src/app' // テスト対象をインポート
import { createTestCases } from './util'

describe('Test all estimations', () => {
  const domains = ['housing', 'mobility', 'food', 'other']
  // eslint-disable-next-line no-undef
  const env = process.env
  const endpoint = env.REST_ENDPOINT
  console.log('endpoint = ' + endpoint)

  const logging = false
  const log = (testCase, title, output) => {
    if (logging) {
      console.log(
        'checking [' +
          testCase.case +
          '] ' +
          title +
          ' : ' +
          output.domain +
          '_' +
          output.item +
          '_' +
          output.type
      )
    }
  }

  /*
  //test('Dummy:', () => {
    expect(true).toBe(true)
  })
  */
  let originalBaselines = null
  beforeAll(async () => {
    // オリジナルのベースライン情報を取得
    const resGet = await request(endpoint || footprintApp)
      .get('/footprints/baseline')
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    originalBaselines = resGet.body
  })

  for (const domain of domains) {
    describe('Test ' + domain + ' estimations', () => {
      // テストケースを記載したExcel
      const workbook = xlsx.readFile(
        'src/tests/estimation-' + domain + '.test-cases.xlsx'
      )
      const testCases = createTestCases(workbook)
      let id = null
      beforeAll(async () => {
        // 最初にProfileの生成
        const resPost = await request(endpoint || app)
          .post('/profiles')
          .send({})
          .set('x-apigateway-event', null) // エラーを出さないおまじない
          .set('x-apigateway-context', null) // エラーを出さないおまじない
        id = resPost.body.data.id
      })

      // 生成したProfileに対してテストケースを順番に適用
      for (const testCase of testCases) {
        test('Estimation: ' + testCase.case, async () => {
          const resPut = await request(endpoint || app)
            .put('/profiles/' + id)
            .send(testCase.toRequest())
            .set('x-apigateway-event', null) // エラーを出さないおまじない
            .set('x-apigateway-context', null) // エラーを出さないおまじない

          expect(resPut.status).toBe(200)

          // 計算したestimationがexpectationとあっているを確認
          const estimations = resPut.body.data.estimations

          for (const estimation of estimations.filter(
            (e) => e.domain === domain
          )) {
            const exp = testCase.expectations.find(
              (e) =>
                e.domain === estimation.domain &&
                e.item === estimation.item &&
                e.type === estimation.type
            )

            log(testCase, 'estimation', estimation)
            expect(exp).not.toBeNull()
            expect(exp.estimated).toBeTruthy()
            expect(estimation.value).toBeCloseTo(exp.value)
          }

          // estimationに重複がないことを確認
          for (let i = 0; i < estimations.length; ++i) {
            for (let j = i + 1; j < estimations.length; ++j) {
              expect(
                estimations[i].domain +
                  estimations[i].item +
                  estimations[i].type
              ).not.toBe(
                estimations[j].domain +
                  estimations[j].item +
                  estimations[j].type
              )
            }
          }

          // expectationがestimatedになっている場合、estimationに値があるかを確認
          for (const exp of testCase.expectations) {
            const estimation = estimations.find(
              (e) =>
                e.domain === exp.domain &&
                e.item === exp.item &&
                e.type === exp.type
            )

            log(testCase, 'existence', exp)
            expect(Boolean(estimation)).toBe(exp.estimated)
          }

          // estimationsとbaselinesの値を合成し、結果が合っているかを確認。
          const baselines = resPut.body.data.baselines

          for (const exp of testCase.expectations) {
            const estimation = estimations.find(
              (e) =>
                e.domain === exp.domain &&
                e.item === exp.item &&
                e.type === exp.type
            )
            const baseline = baselines.find(
              (b) =>
                b.domain === exp.domain &&
                b.item === exp.item &&
                b.type === exp.type
            )
            const result = estimation ? estimation : baseline

            log(testCase, 'result', result)
            expect(result.value).toBeCloseTo(exp.value)
          }

          // baselineが間違って書き換えられていないかを確認
          for (const baseline of baselines.filter((b) => b.domain === domain)) {
            const org = originalBaselines.find(
              (b) =>
                b.domain === baseline.domain &&
                b.item === baseline.item &&
                b.type === baseline.type
            )

            log(testCase, 'baseline', org)
            expect(baseline.value).toBeCloseTo(org.value)
          }
        })
      }
    })
  }
})
