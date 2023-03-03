import request from 'supertest'
import xlsx from 'xlsx'
// local mock の設定。テスト対象をimportする前に設定
process.env.TABLE_REGION = 'ap-northeast-1' // eslint-disable-line no-undef
process.env.ENV = 'dev' // eslint-disable-line no-undef
process.env.AWS_EXECUTION_ENV = 'local-mock' // eslint-disable-line no-undef
import app from '../../lib/lambda/profile-app' // テスト対象をインポート
import footprintApp from '../../lib/lambda/footprint-app' // テスト対象をインポート
import { createTestCases, TestCase } from './util'

describe('Test all integrations', () => {
  const domains = ['housing', 'mobility', 'other', 'extra']
  // eslint-disable-next-line no-undef
  const endpoint = process.env.REST_ENDPOINT
  console.log('endpoint = ' + endpoint)

  const logging = false
  const log = (testCase: TestCase, title: string, output: any) => {
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

  let originalBaselines: any = null
  beforeAll(async () => {
    // オリジナルのベースライン情報を取得
    const resGet = await request(endpoint || footprintApp)
      .get('/footprints/baseline')
      .set('x-apigateway-event', 'null') // エラーを出さないおまじない
      .set('x-apigateway-context', 'null') // エラーを出さないおまじない

    originalBaselines = resGet.body
  })

  for (const domain of domains) {
    describe('Test ' + domain + ' integrations', () => {
      // テストケースを記載したExcel
      const workbook = xlsx.readFile(
        'src/tests/integration-' + domain + '.test-cases.xlsx'
      )
      const testCases = createTestCases(workbook)
      let id: string | null = null
      beforeAll(async () => {
        // 最初にProfileの生成
        const resPost = await request(endpoint || app)
          .post('/profiles')
          .send({})
          .set('x-apigateway-event', 'null') // エラーを出さないおまじない
          .set('x-apigateway-context', 'null') // エラーを出さないおまじない
        id = resPost.body.data.id
      })

      // 生成したProfileに対してテストケースを順番に適用
      for (const testCase of testCases) {
        test('Estimation: ' + testCase.case, async () => {
          const req = testCase.toRequest()
          req.estimate = true
          const resPut = await request(endpoint || app)
            .put('/profiles/' + id)
            .send(req)
            .set('x-apigateway-event', 'null') // エラーを出さないおまじない
            .set('x-apigateway-context', 'null') // エラーを出さないおまじない

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

            log(testCase, 'estimation', estimation)
            expect(exp).not.toBeNull()
            expect(exp?.estimated).toBeTruthy()
            expect(estimation.value).toBeCloseTo(exp ? exp.value : NaN)
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
              (e: any) =>
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
              (e: any) =>
                e.domain === exp.domain &&
                e.item === exp.item &&
                e.type === exp.type
            )
            const baseline = baselines.find(
              (b: any) =>
                b.domain === exp.domain &&
                b.item === exp.item &&
                b.type === exp.type
            )
            const result = estimation ? estimation : baseline

            log(testCase, 'result', result)
            expect(result.value).toBeCloseTo(exp.value)
          }

          // baselineが間違って書き換えられていないかを確認
          for (const baseline of baselines) {
            const org = originalBaselines.find(
              (b: any) =>
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
