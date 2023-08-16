import { validate } from './actions/validate'
import {
  estimateMobility,
  estimateHousing,
  estimateFood,
  estimateOther,
  enumerateBaselinesBy
} from './utils/adapter'
import { optionIntensityRates } from './actions/data'

const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const { v4: uuid } = require('uuid')
const shortid = require('shortid')
import express from 'express'
import { Diagnosis } from 'cfp-calc'

const FOOTPRINT_TABLE_NAME = process.env.FOOTPRINT_TABLE_NAME || ''
const PARAMETER_TABLE_NAME = process.env.PARAMETER_TABLE_NAME || ''
const PROFILE_TABLE_NAME = process.env.PROFILE_TABLE_NAME || ''
const OPTION_TABLE_NAME = process.env.OPTION_TABLE_NAME || ''
const MOCK = process.env.LOCALSTACK_HOSTNAME ? true : false

let dynamoParam = {}
let footprintTableName = FOOTPRINT_TABLE_NAME
let parameterTableName = PARAMETER_TABLE_NAME
let profileTableName = PROFILE_TABLE_NAME
let optionTableName = OPTION_TABLE_NAME

if (MOCK) {
  // for mock and localstack
  dynamoParam = {
    endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`,
    region: 'ap-northeast-1',
    accessKeyId: 'testUser',
    secretAccessKey: 'testAccessKey'
  }
  footprintTableName = 'localJibungotoPlanetfootprint'
  parameterTableName = 'localJibungotoPlanetparameter'
  profileTableName = 'localJibungotoPlanetprofile'
  optionTableName = 'localJibungotoPlanetoption'
}

const dynamodb = new AWS.DynamoDB.DocumentClient(dynamoParam)

const path = '/profiles'

// declare a new express app
const app: express.Express = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

const toResponse = (profile: any, estimate: any) => {
  const common = {
    id: profile.id,
    shareId: profile.shareId,

    gender: profile.gender,
    age: profile.age,
    region: profile.region,

    actionIntensityRates: profile.actionIntensityRates,
    mobilityAnswer: profile.mobilityAnswer,
    housingAnswer: profile.housingAnswer,
    foodAnswer: profile.foodAnswer,
    otherAnswer: profile.otherAnswer
  }

  return estimate
    ? {
        ...common,
        baselines: profile.baselines,
        estimations: profile.estimations,
        actions: profile.actions
      }
    : common
}

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/:id', async (req: express.Request, res: express.Response) => {
  try {
    const data = await dynamodb
      .get({
        TableName: profileTableName,
        Key: { id: req.params.id }
      })
      .promise()

    const profile = data.Item

    // 計算がされていない場合は遅延初期化
    if (!profile.estimated) {
      await updateProfile(dynamodb, profile)
      profile.estimated = true
      profile.updatedAt = new Date().toISOString()
      await dynamodb
        .put({
          TableName: profileTableName,
          Item: profile
        })
        .promise()
    }

    res.json(toResponse(profile, true))
  } catch (err) {
    res.statusCode = 500
    res.json({ error: 'Could not load item: ' + err })
  }
})

const mergeActionIntensityRates = (orgRates: any, newRates: any) => {
  // actionIntensityRatesの展開
  return orgRates.map((item: any) => {
    let value = newRates?.find((air: any) => air.option === item.option)?.value
    if (value === null || value === undefined || isNaN(value)) {
      if (item.value === null || item.value === undefined) {
        value = 0 // 0で初期化
      } else {
        value = item.value
      }
    }
    return {
      option: item.option,
      value: Number(value),
      defaultValue: item.defaultValue,
      range: item.range
    }
  })
}

const updateProfile = async (dynamodb: any, profile: any) => {
  profile.baselines = []
  profile.estimations = []

  const diagnosis = new Diagnosis()

  if (profile.housingAnswer) {
    estimateHousing(profile.housingAnswer, profile.mobilityAnswer, diagnosis)
    profile.baselines = profile.baselines.concat(
      enumerateBaselinesBy('housing')
    )
  }

  if (profile.mobilityAnswer) {
    estimateMobility(profile.housingAnswer, profile.mobilityAnswer, diagnosis)
    profile.baselines = profile.baselines.concat(
      enumerateBaselinesBy('mobility')
    )
  }

  if (profile.foodAnswer) {
    estimateFood(profile.foodAnswer, diagnosis)
    profile.baselines = profile.baselines.concat(enumerateBaselinesBy('food'))
  }

  if (profile.otherAnswer) {
    estimateOther(profile.housingAnswer, profile.otherAnswer, diagnosis)
    profile.baselines = profile.baselines.concat(enumerateBaselinesBy('other'))
  }

  profile.estimations = diagnosis.enumerateEstimations()
  profile.actions = diagnosis.enumerateActions()
}

/************************************
 * HTTP put method for insert object *
 *************************************/

app.put(path + '/:id', async (req: express.Request, res: express.Response) => {
  const id = req.params.id
  const estimate = req.body.estimate
  const body: any = req.body

  if (validate(req.body)) {
    try {
      const data = await dynamodb
        .get({
          TableName: profileTableName,
          Key: { id }
        })
        .promise()
      const profile = data.Item

      if (body.mobilityAnswer) {
        profile.mobilityAnswer = body.mobilityAnswer
      }
      if (body.housingAnswer) {
        profile.housingAnswer = body.housingAnswer
      }
      if (body.foodAnswer) {
        profile.foodAnswer = body.foodAnswer
      }
      if (body.otherAnswer) {
        profile.otherAnswer = body.otherAnswer
      }
      if (body.gender) {
        profile.gender = body.gender
      }
      if (body.age) {
        profile.age = body.age
      }
      if (body.region) {
        profile.region = body.region
      }

      profile.actionIntensityRates = mergeActionIntensityRates(
        profile.actionIntensityRates,
        body.actionIntensityRates
      )
      profile.estimated = false

      if (estimate) {
        await updateProfile(dynamodb, profile)
        profile.updatedAt = new Date().toISOString()
        profile.estimated = true
      }

      await dynamodb
        .put({
          TableName: profileTableName,
          Item: profile
        })
        .promise()
      res.json({
        success: 'put call succeed!',
        url: req.url,
        data: toResponse(profile, estimate)
      })
    } catch (err) {
      res.statusCode = 500
      res.json({ error: 'Could not load items: ' + err })
    }
  } else {
    res.statusCode = 400
    res.json({ error: validate.errors })
  }
})

/************************************
 * HTTP post method for insert object *
 *************************************/

app.post(path, async (req: express.Request, res: express.Response) => {
  if (validate(req.body)) {
    try {
      const body: any = req.body
      const estimate = body.estimate

      const profile = {
        estimated: false,
        id: uuid(),
        shareId: shortid.generate(),
        mobilityAnswer: body.mobilityAnswer,
        housingAnswer: body.housingAnswer,
        foodAnswer: body.foodAnswer,
        otherAnswer: body.otherAnswer,
        gender: body.gender,
        age: body.age,
        region: body.region,

        baselines: [],
        estimations: [],
        actionIntensityRates: [],

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      profile.actionIntensityRates = mergeActionIntensityRates(
        optionIntensityRates,
        body.actionIntensityRates
      )

      if (estimate) {
        await updateProfile(dynamodb, profile)
        profile.estimated = true
      }

      const params = {
        TableName: profileTableName,
        Item: profile
      }
      await dynamodb.put(params).promise()
      res.json({
        success: 'post call succeed!',
        url: req.url,
        data: toResponse(profile, estimate)
      })
    } catch (err) {
      res.statusCode = 500
      res.json({ error: err, url: req.url, body: req.body })
    }
  } else {
    res.statusCode = 400
    res.json({ error: validate.errors })
  }
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
export default app
