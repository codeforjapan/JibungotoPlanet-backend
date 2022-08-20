import request from 'supertest'
// local mock の設定。テスト対象をimportする前に設定
process.env.TABLE_REGION = 'us-fake-1' // eslint-disable-line no-undef
process.env.ENV = 'dev' // eslint-disable-line no-undef
process.env.AWS_EXECUTION_ENV = 'local-mock' // eslint-disable-line no-undef
import app from '../../amplify/backend/function/profilea2218c7f/src/app' // テスト対象をインポート
import shareApp from '../../amplify/backend/function/shareb311c853/src/app' // テスト対象をインポート

describe('Test profile operation', () => {
  test('create profile without estimation and answers', async () => {
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

    expect(resPost.status).toBe(200)
    expect(profile.gender).toBe('male')
    expect(profile.age).toBe('20s')
    expect(profile.region).toBe('hokkaido')
    expect(profile.actionIntensityRates.length).toBe(34)
    expect(profile.baselines).toBeFalsy()
    expect(profile.estimations).toBeFalsy()
    expect(profile.actions).toBeFalsy()
  })

  test('create profile without answers', async () => {
    const resPost = await request(app)
      .post('/profiles')
      .send({
        estimate: true,
        gender: 'male',
        age: '20s',
        region: 'hokkaido'
      })
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    const profile = resPost.body.data

    expect(resPost.status).toBe(200)
    expect(profile.gender).toBe('male')
    expect(profile.age).toBe('20s')
    expect(profile.region).toBe('hokkaido')
    expect(profile.actionIntensityRates.length).toBe(34)
    expect(profile.baselines.length).toBe(0)
    expect(profile.estimations.length).toBe(0)
    expect(profile.actions.length).toBe(0)
  })

  test('create profile with estimation', async () => {
    const resPost = await request(app)
      .post('/profiles')
      .send({
        estimate: true,
        gender: 'male',
        age: '20s',
        region: 'hokkaido',
        mobilityAnswer: {},
        housingAnswer: {},
        foodAnswer: {},
        otherAnswer: {}
      })
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    const profile = resPost.body.data

    expect(resPost.status).toBe(200)
    expect(profile.gender).toBe('male')
    expect(profile.age).toBe('20s')
    expect(profile.region).toBe('hokkaido')
    expect(profile.actionIntensityRates.length).toBe(34)
    expect(profile.baselines.length > 0).toBeTruthy()
    expect(profile.estimations.length > 0).toBeTruthy()
    expect(profile.actions.length > 0).toBeTruthy()
  })

  test('create profile without estimation', async () => {
    const resPost = await request(app)
      .post('/profiles')
      .send({
        gender: 'male',
        age: '20s',
        region: 'hokkaido',
        mobilityAnswer: {},
        housingAnswer: {},
        foodAnswer: {},
        otherAnswer: {}
      })
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    const profile = resPost.body.data

    expect(resPost.status).toBe(200)
    expect(profile.gender).toBe('male')
    expect(profile.age).toBe('20s')
    expect(profile.region).toBe('hokkaido')
    expect(profile.actionIntensityRates.length).toBe(34)
    expect(profile.baselines).toBeFalsy()
    expect(profile.estimations).toBeFalsy()
    expect(profile.actions).toBeFalsy()
  })

  test('create profile without estimation, then get profile', async () => {
    // estimateしないpostを投げる
    const resPost = await request(app)
      .post('/profiles')
      .send({
        gender: 'male',
        age: '20s',
        region: 'hokkaido',
        mobilityAnswer: {},
        housingAnswer: {},
        foodAnswer: {},
        otherAnswer: {}
      })
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    const profile = resPost.body.data

    expect(resPost.status).toBe(200)
    expect(profile.gender).toBe('male')
    expect(profile.age).toBe('20s')
    expect(profile.region).toBe('hokkaido')
    expect(profile.actionIntensityRates.length).toBe(34)
    expect(profile.baselines).toBeFalsy()
    expect(profile.estimations).toBeFalsy()
    expect(profile.actions).toBeFalsy()

    // shareIdでprofileを取得する（estimate前なので404が返る）
    const resShareGet = await request(shareApp)
      .get('/shares/' + profile.shareId)
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    const sharedProfile = resShareGet.body

    expect(resShareGet.status).toBe(404)
    expect(Object.keys(sharedProfile).length).toBe(0)
    expect(Object.values(sharedProfile).length).toBe(0)

    // idでprofileを取得する（遅延初期化でfootprint推定値が計算される）
    const resGet = await request(app)
      .get('/profiles/' + profile.id)
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    const newProfile = resGet.body

    expect(resGet.status).toBe(200)
    expect(newProfile.gender).toBe('male')
    expect(newProfile.age).toBe('20s')
    expect(newProfile.region).toBe('hokkaido')
    expect(newProfile.actionIntensityRates.length).toBe(34)
    expect(newProfile.baselines.length > 0).toBeTruthy()
    expect(newProfile.estimations.length > 0).toBeTruthy()
    expect(newProfile.actions.length > 0).toBeTruthy()

    // 更にshareIdでprofileを取得する
    const resShareGetAfter = await request(shareApp)
      .get('/shares/' + profile.shareId)
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    const sharedProfileAfter = resShareGetAfter.body

    expect(resShareGetAfter.status).toBe(200)
    expect(sharedProfileAfter.shareId).toBe(profile.shareId)
    expect(sharedProfileAfter.id).toBeFalsy()
    expect(sharedProfileAfter.gender).toBeFalsy()
    expect(sharedProfileAfter.age).toBeFalsy()
    expect(sharedProfileAfter.region).toBeFalsy()
    expect(sharedProfileAfter.actionIntensityRates.length).toBe(34)
    expect(sharedProfileAfter.baselines.length > 0).toBeTruthy()
    expect(sharedProfileAfter.estimations.length > 0).toBeTruthy()
    expect(sharedProfileAfter.actions.length > 0).toBeTruthy()
  })

  test('create profile without estimation, then post profile', async () => {
    // estimateしないpostを投げる
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

    expect(resPost.status).toBe(200)
    expect(profile.gender).toBe('male')
    expect(profile.age).toBe('20s')
    expect(profile.region).toBe('hokkaido')
    expect(profile.actionIntensityRates.length).toBe(34)
    expect(profile.baselines).toBeFalsy()
    expect(profile.estimations).toBeFalsy()
    expect(profile.actions).toBeFalsy()

    const resPut = await request(app)
      .put('/profiles/' + profile.id)
      .send({
        estimate: true,
        mobilityAnswer: {},
        housingAnswer: {},
        foodAnswer: {},
        otherAnswer: {}
      })
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    const newProfile = resPut.body.data
    expect(resPut.status).toBe(200)
    expect(newProfile.gender).toBe('male')
    expect(newProfile.age).toBe('20s')
    expect(newProfile.region).toBe('hokkaido')
    expect(newProfile.actionIntensityRates.length).toBe(34)
    expect(newProfile.baselines.length > 0).toBeTruthy()
    expect(newProfile.estimations.length > 0).toBeTruthy()
    expect(newProfile.actions.length > 0).toBeTruthy()
  })

  test('create profile, then update actionIntensityRate', async () => {
    // estimateしないpostを投げる
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

    expect(resPost.status).toBe(200)
    expect(profile.gender).toBe('male')
    expect(profile.age).toBe('20s')
    expect(profile.region).toBe('hokkaido')
    expect(profile.actionIntensityRates.length).toBe(34)
    for (const air of profile.actionIntensityRates) {
      expect(air.value).toBe(0)
    }
    expect(profile.baselines).toBeFalsy()
    expect(profile.estimations).toBeFalsy()
    expect(profile.actions).toBeFalsy()

    // actionIntensityRatesを更新
    const resPut = await request(app)
      .put('/profiles/' + profile.id)
      .send({
        actionIntensityRates: [
          {
            option: 'zeh',
            value: 1
          },
          {
            option: 'self-re',
            value: 1
          }
        ]
      })
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    const newProfile = resPut.body.data
    expect(resPut.status).toBe(200)
    expect(newProfile.gender).toBe('male')
    expect(newProfile.age).toBe('20s')
    expect(newProfile.region).toBe('hokkaido')
    expect(newProfile.actionIntensityRates.length).toBe(34)
    for (const air of newProfile.actionIntensityRates) {
      expect(air.value).toBe(
        air.option === 'zeh' || air.option === 'self-re' ? 1 : 0
      )
    }

    // answerを更新してfootprintを計算
    const resPut2 = await request(app)
      .put('/profiles/' + profile.id)
      .send({
        estimate: true,
        mobilityAnswer: {},
        housingAnswer: {},
        foodAnswer: {},
        otherAnswer: {}
      })
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    const newProfile2 = resPut2.body.data
    expect(resPut2.status).toBe(200)
    expect(newProfile2.gender).toBe('male')
    expect(newProfile2.age).toBe('20s')
    expect(newProfile2.region).toBe('hokkaido')
    expect(newProfile2.actionIntensityRates.length).toBe(34)
    expect(newProfile2.baselines.length > 0).toBeTruthy()
    expect(newProfile2.estimations.length > 0).toBeTruthy()
    expect(newProfile2.actions.length > 0).toBeTruthy()
    for (const air of newProfile2.actionIntensityRates) {
      expect(air.value).toBe(
        air.option === 'zeh' || air.option === 'self-re' ? 1 : 0
      )
    }
  })

  test('create profile with unsupported gender', async () => {
    const resPost = await request(app)
      .post('/profiles')
      .send({
        estimate: true,
        gender: 'man',
        age: '20s',
        region: 'hokkaido',
        mobilityAnswer: {},
        housingAnswer: {},
        foodAnswer: {},
        otherAnswer: {}
      })
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    expect(resPost.status).toBe(400)
  })

  test('create profile with unsupported answers', async () => {
    const resPost = await request(app)
      .post('/profiles')
      .send({
        estimate: true,
        gender: 'man',
        age: '20',
        region: 'hokkaido',
        mobilityAnswer: {
          carIntensityFactorFirstKey: 'horse'
        },
        housingAnswer: {
          housingSizeKey: '10-room'
        }
      })
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    expect(resPost.status).toBe(400)
  })

  test('create profile with a long wrong key', async () => {
    const resPost = await request(app)
      .post('/profiles')
      .send({
        estimate: true,
        housingAnswer: {
          housingSizeKey: 'unknown-answer'
        }
      })
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    expect(resPost.status).toBe(400)
  })

  test('create profile with residentCount = 0', async () => {
    const resPost = await request(app)
      .post('/profiles')
      .send({
        estimate: true,
        housingAnswer: {
          residentCount: 0
        }
      })
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    expect(resPost.status).toBe(400)
  })

  test('create profile with otherCarAnnualTravelingTime = -100', async () => {
    const resPost = await request(app)
      .post('/profiles')
      .send({
        estimate: true,
        mobilityAnswer: {
          hasTravelingTime: true,
          otherCarAnnualTravelingTime: -100
        }
      })
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    expect(resPost.status).toBe(400)
  })

  test('create profile with keroseneMonthlyConsumption = 100', async () => {
    const resPost = await request(app)
      .post('/profiles')
      .send({
        estimate: true,
        mobilityAnswer: {
          useKerosene: true,
          keroseneMonthlyConsumption: 100
        }
      })
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    expect(resPost.status).toBe(200)
  })

  test('create profile with trainWeeklyTravelingTime = 0 and busWeeklyTravelingTime = 100', async () => {
    const resPost = await request(app)
      .post('/profiles')
      .send({
        estimate: true,
        mobilityAnswer: {
          hasTravelingTime: true,
          trainWeeklyTravelingTime: 0,
          busWeeklyTravelingTime: 100
        }
      })
      .set('x-apigateway-event', null) // エラーを出さないおまじない
      .set('x-apigateway-context', null) // エラーを出さないおまじない

    expect(resPost.status).toBe(200)
  })
})
