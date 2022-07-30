import request from 'supertest'
import xlsx from 'xlsx'
// local mock の設定。テスト対象をimportする前に設定
process.env.TABLE_REGION = 'us-fake-1' // eslint-disable-line no-undef
process.env.ENV = 'dev' // eslint-disable-line no-undef
process.env.AWS_EXECUTION_ENV = 'local-mock' // eslint-disable-line no-undef
import app from '../../amplify/backend/function/profilea2218c7f/src/app' // テスト対象をインポート
import footprintApp from '../../amplify/backend/function/footprintf523f2c8/src/app' // テスト対象をインポート
import { createTestCases } from './util'

describe('Test all options', () => {
  const options = ['telework', 'closework', 'mictourism']

  for (const option of options) {
    console.log('now testing : ' + option)

    // テストケースを記載したExcel
    const workbook = xlsx.readFile(
      'src/tests/' + option + '-option.test-cases.xlsx'
    )
    const testCases = createTestCases(workbook)

    test('Option: ' + option, async () => {
      // オリジナルのベースライン情報を取得
      const resGet = await request(footprintApp)
        .get('/footprints/baseline')
        .set('x-apigateway-event', null) // エラーを出さないおまじない
        .set('x-apigateway-context', null) // エラーを出さないおまじない

      const originalBaselines = resGet.body

      const logging = true
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
        const actions = resPut.body.data.actions

        /*
      actions.forEach((a) => {
        console.log(a.option + ':' + a.domain + ':' + a.item + ':' + a.type)
      })
      */

        for (const action of actions.filter((a) => a.option === option)) {
          const exp = testCase.expectations.find(
            (e) =>
              e.domain === action.domain &&
              e.item === action.item &&
              e.type === action.type
          )
          log(testCase, 'action', action)
          expect(exp).not.toBeNull()
          expect(exp.estimated).toBeTruthy()
          expect(action.value).toBeCloseTo(exp.value)
        }

        // expectationがestimatedになっている場合、actionに値があるかを確認
        for (const exp of testCase.expectations) {
          const action = actions
            .filter((a) => a.option === option)
            .find(
              (a) =>
                a.domain === exp.domain &&
                a.item === exp.item &&
                a.type === exp.type
            )
          log(testCase, 'estimated', exp)
          expect(Boolean(action)).toBe(exp.estimated)
        }

        // baselineが間違って書き換えられていないかを確認
        const baselines = resPut.body.data.baselines
        for (const baseline of baselines) {
          const org = originalBaselines.find(
            (b) =>
              b.domain === baseline.domain &&
              b.item === baseline.item &&
              b.type === baseline.type
          )
          expect(baseline.value).toBeCloseTo(org.value)
        }
      }
    })
  }
})
