import request from 'supertest'
import xlsx from 'xlsx'
// local mock の設定。テスト対象をimportする前に設定
process.env.TABLE_REGION = 'ap-northeast-1' // eslint-disable-line no-undef
process.env.ENV = 'dev' // eslint-disable-line no-undef
process.env.LOCALSTACK_HOSTNAME = 'localhost' // eslint-disable-line no-undef
import app from '../../lib/lambda/profile-app' // テスト対象をインポート
import footprintApp from '../../lib/lambda/footprint-app' // テスト対象をインポート
import { createTestCases, Expectation, TestCase } from './util'

jest.retryTimes(2)

describe('Test all options', () => {
  const options = [
    'telework',
    'closework',
    'mictourism',
    'closeservice',
    'dailyshift',
    'longshift',
    'rideshare',
    'carshare',
    'car-ev-phv',
    'car-ev-phv-re',

    'vegan',
    'vegetarian',
    'white-meat-fish',
    'guide-meal',
    'guide-snack-drink',
    'seasonal',
    'local',
    'loss',

    'clothes-accessory',
    'electronics-furniture',
    'hobby',
    'consumables',
    'books',
    'eco-tourism',

    'zeh',
    'self-re',
    'grid-re',
    'com-house',
    'insrenov',
    'clothes-home',
    'ec',
    'ac',
    'led',
    'enenudge'
  ]
  // eslint-disable-next-line no-undef
  const env = process.env
  const endpoint = env.REST_ENDPOINT
  console.log('endpoint = ' + endpoint)

  const logging = false
  const log = (testCase: TestCase, title: string, output: Expectation) => {
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

  for (const option of options) {
    describe('Test ' + option + ' options', () => {
      // テストケースを記載したExcel
      const workbook = xlsx.readFile(
        'src/tests/option-' + option + '.test-cases.xlsx'
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
        test('Option: ' + option, async () => {
          const req = testCase.toRequest()
          req.estimate = true

          const resPut = await request(endpoint || app)
            .put('/profiles/' + id)
            .send(req)
            .set('x-apigateway-event', 'null') // エラーを出さないおまじない
            .set('x-apigateway-context', 'null') // エラーを出さないおまじない

          expect(resPut.status).toBe(200)

          // 計算したestimationがexpectationとあっているを確認
          const actions = resPut.body.data.actions

          for (const action of actions.filter(
            (a: any) => a.option === option
          )) {
            const exp = testCase.expectations.find(
              (e) =>
                e.domain === action.domain &&
                e.item === action.item &&
                e.type === action.type
            )

            log(testCase, 'action', action)
            expect(exp).not.toBeNull()
            expect(exp?.estimated).toBeTruthy()
            expect(action.value).toBeCloseTo(exp ? exp.value : NaN)
          }

          // actionに重複がないことを確認
          for (let i = 0; i < actions.length; ++i) {
            for (let j = i + 1; j < actions.length; ++j) {
              expect(
                actions[i].option +
                  actions[i].domain +
                  actions[i].item +
                  actions[i].type
              ).not.toBe(
                actions[j].option +
                  actions[j].domain +
                  actions[j].item +
                  actions[j].type
              )
            }
          }

          // expectationがestimatedになっている場合、actionに値があるかを確認
          for (const exp of testCase.expectations) {
            const action = actions
              .filter((a: any) => a.option === option)
              .find(
                (a: any) =>
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
              (b: any) =>
                b.domain === baseline.domain &&
                b.item === baseline.item &&
                b.type === baseline.type
            )
            expect(baseline.value).toBeCloseTo(org.value)
          }
        })
      }
    })
  }
})
