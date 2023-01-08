import { validate } from "./actions/validate";
import { estimateMobility } from "./actions/mobility";
import { estimateHousing } from "./actions/housing";
import { estimateFood } from "./actions/food";
import { estimateOther } from "./actions/other";
import { calculateActions } from "./actions/action";
import { optionIntensityRates } from "./actions/data";

const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const { v4: uuid } = require('uuid')
const shortid = require('shortid')
import express from 'express'

const FOOTPRINT_TABLE_NAME = process.env.FOOTPRINT_TABLE_NAME || "";
const PARAMETER_TABLE_NAME = process.env.PARAMETER_TABLE_NAME || "";
const PROFILE_TABLE_NAME = process.env.PROFILE_TABLE_NAME || "";
const OPTION_TABLE_NAME = process.env.OPTION_TABLE_NAME || "";
const MOCK = process.env.mock || false


let dynamoParam = {}
let footprintTableName = FOOTPRINT_TABLE_NAME
let parameterTableName = PARAMETER_TABLE_NAME
let profileTableName = PROFILE_TABLE_NAME
let optionTableName = OPTION_TABLE_NAME

if (MOCK) {
  // for local mock
  dynamoParam = {
    endpoint: 'http://localhost:62224',
    region: 'us-fake-1',
    accessKeyId: 'fake',
    secretAccessKey: 'fake'
  }
  footprintTableName = 'FootprintTable'
  parameterTableName = 'ParameterTable'
  profileTableName = 'ProfileTable'
  optionTableName = 'OptionTable'
}

const dynamodb = new AWS.DynamoDB.DocumentClient(dynamoParam)

const path = '/profiles'

// declare a new express app
const app: express.Express = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
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

const mergeActionIntensityRates = (orgRates: any, newRates:any) => {
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

  if (profile.housingAnswer) {
    const { baselines, estimations } = await estimateHousing(
      dynamodb,
      profile.housingAnswer,
      profile.mobilityAnswer,
      footprintTableName,
      parameterTableName
    )
    profile.baselines = profile.baselines.concat(baselines)
    profile.estimations = profile.estimations.concat(estimations)
  }

  if (profile.mobilityAnswer) {
    const { baselines, estimations } = await estimateMobility(
      dynamodb,
      profile.housingAnswer,
      profile.mobilityAnswer,
      footprintTableName,
      parameterTableName
    )
    profile.baselines = profile.baselines.concat(baselines)
    profile.estimations = profile.estimations.concat(estimations)
  }

  if (profile.foodAnswer) {
    const { baselines, estimations } = await estimateFood(
      dynamodb,
      profile.foodAnswer,
      footprintTableName,
      parameterTableName
    )
    profile.baselines = profile.baselines.concat(baselines)
    profile.estimations = profile.estimations.concat(estimations)
  }

  if (profile.otherAnswer) {
    const { baselines, estimations } = await estimateOther(
      dynamodb,
      profile.housingAnswer,
      profile.otherAnswer,
      footprintTableName,
      parameterTableName
    )
    profile.baselines = profile.baselines.concat(baselines)
    profile.estimations = profile.estimations.concat(estimations)
  }

  profile.actions = await calculateActions(
    dynamodb,
    profile.baselines,
    profile.estimations,
    profile.housingAnswer,
    profile.mobilityAnswer,
    profile.foodAnswer,
    parameterTableName,
    optionTableName
  )
}

/************************************
 * HTTP put method for insert object *
 *************************************/

app.put(path + '/:id', async (req: express.Request, res: express.Response) => {
  const id = req.params.id
  const estimate = req.body.estimate

  if (validate(req.body)) {
    try {
      const data = await dynamodb
        .get({
          TableName: profileTableName,
          Key: { id }
        })
        .promise()
      const profile = data.Item

      if (req.body.mobilityAnswer) {
        profile.mobilityAnswer = req.body.mobilityAnswer
      }
      if (req.body.housingAnswer) {
        profile.housingAnswer = req.body.housingAnswer
      }
      if (req.body.foodAnswer) {
        profile.foodAnswer = req.body.foodAnswer
      }
      if (req.body.otherAnswer) {
        profile.otherAnswer = req.body.otherAnswer
      }
      if (req.body.gender) {
        profile.gender = req.body.gender
      }
      if (req.body.age) {
        profile.age = req.body.age
      }
      if (req.body.region) {
        profile.region = req.body.region
      }

      profile.actionIntensityRates = mergeActionIntensityRates(
        profile.actionIntensityRates,
        req.body.actionIntensityRates
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
      const estimate = req.body.estimate

      const profile = {
        estimated: false,
        id: uuid(),
        shareId: shortid.generate(),
        mobilityAnswer: req.body.mobilityAnswer,
        housingAnswer: req.body.housingAnswer,
        foodAnswer: req.body.foodAnswer,
        otherAnswer: req.body.otherAnswer,
        gender: req.body.gender,
        age: req.body.age,
        region: req.body.region,

        baselines: [],
        estimations: [],
        actionIntensityRates: [],

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      profile.actionIntensityRates = mergeActionIntensityRates(
        optionIntensityRates,
        req.body.actionIntensityRates
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
