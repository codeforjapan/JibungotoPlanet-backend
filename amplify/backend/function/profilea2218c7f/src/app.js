/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_FOOTPRINT3UYVQUM6JRC4PF63CDE7NJSXEIDEV_ARN
	STORAGE_FOOTPRINT3UYVQUM6JRC4PF63CDE7NJSXEIDEV_NAME
	STORAGE_FOOTPRINT3UYVQUM6JRC4PF63CDE7NJSXEIDEV_STREAMARN
	STORAGE_FOOTPRINTZ6DHUM3EDRGFPB2GC4MMJDEXPUPRD_ARN
	STORAGE_FOOTPRINTZ6DHUM3EDRGFPB2GC4MMJDEXPUPRD_NAME
	STORAGE_FOOTPRINTZ6DHUM3EDRGFPB2GC4MMJDEXPUPRD_STREAMARN
	STORAGE_OPTION3UYVQUM6JRC4PF63CDE7NJSXEIDEV_ARN
	STORAGE_OPTION3UYVQUM6JRC4PF63CDE7NJSXEIDEV_NAME
	STORAGE_OPTION3UYVQUM6JRC4PF63CDE7NJSXEIDEV_STREAMARN
	STORAGE_OPTIONZ6DHUM3EDRGFPB2GC4MMJDEXPUPRD_ARN
	STORAGE_OPTIONZ6DHUM3EDRGFPB2GC4MMJDEXPUPRD_NAME
	STORAGE_OPTIONZ6DHUM3EDRGFPB2GC4MMJDEXPUPRD_STREAMARN
	STORAGE_PARAMETER3UYVQUM6JRC4PF63CDE7NJSXEIDEV_ARN
	STORAGE_PARAMETER3UYVQUM6JRC4PF63CDE7NJSXEIDEV_NAME
	STORAGE_PARAMETER3UYVQUM6JRC4PF63CDE7NJSXEIDEV_STREAMARN
	STORAGE_PARAMETERZ6DHUM3EDRGFPB2GC4MMJDEXPUPRD_ARN
	STORAGE_PARAMETERZ6DHUM3EDRGFPB2GC4MMJDEXPUPRD_NAME
	STORAGE_PARAMETERZ6DHUM3EDRGFPB2GC4MMJDEXPUPRD_STREAMARN
	STORAGE_PROFILE3UYVQUM6JRC4PF63CDE7NJSXEIDEV_ARN
	STORAGE_PROFILE3UYVQUM6JRC4PF63CDE7NJSXEIDEV_NAME
	STORAGE_PROFILE3UYVQUM6JRC4PF63CDE7NJSXEIDEV_STREAMARN
	STORAGE_PROFILEZ6DHUM3EDRGFPB2GC4MMJDEXPUPRD_ARN
	STORAGE_PROFILEZ6DHUM3EDRGFPB2GC4MMJDEXPUPRD_NAME
	STORAGE_PROFILEZ6DHUM3EDRGFPB2GC4MMJDEXPUPRD_STREAMARN
Amplify Params - DO NOT EDIT */

const { estimateMobility } = require('./mobility')
const { estimateFood } = require('./food')
const { estimateOther } = require('./other')
const { estimateHousing } = require('./housing')
const { calculateActions } = require('./action')
const { optionIntensityRates } = require('./data')

const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const express = require('express')
const { v4: uuid } = require('uuid')
const shortid = require('shortid')

AWS.config.update({ region: process.env.TABLE_REGION })

let suffix = '3uyvqum6jrc4pf63cde7njsxei-dev'
if (process.env.ENV && process.env.ENV !== 'NONE') {
  if (process.env.ENV === 'stg') {
    suffix = 'epwhhio5abgdthpzpwfkaox4ba-stg'
  } else if (process.env.ENV === 'prd') {
    suffix = 'z6dhum3edrgfpb2gc4mmjdexpu-prd'
  }
}

let dynamoParam = {}
let footprintTableName = 'Footprint-' + suffix
let parameterTableName = 'Parameter-' + suffix
let profileTableName = 'Profile-' + suffix
let optionTableName = 'Option-' + suffix

if (
  'AWS_EXECUTION_ENV' in process.env &&
  process.env.AWS_EXECUTION_ENV.endsWith('-mock')
) {
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
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  next()
})

const toResponse = (profile, estimate) => {
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

app.get(path + '/:id', async (req, res) => {
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

const mergeActionIntensityRates = (orgRates, newRates) => {
  // actionIntensityRatesの展開
  return orgRates.map((item) => {
    let value = newRates?.find((air) => air.option === item.option)?.value
    if (value === null || value === undefined) {
      if (item.value === null || item.value === undefined) {
        value = item.defaultValue
      } else {
        value = item.value
      }
    }
    return {
      option: item.option,
      value: value,
      defaultValue: item.defaultValue,
      range: item.range
    }
  })
}

const updateProfile = async (dynamodb, profile) => {
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

  const actions = await calculateActions(
    dynamodb,
    profile.baselines,
    profile.estimations,
    profile.housingAnswer,
    profile.mobilityAnswer,
    profile.foodAnswer,
    parameterTableName,
    optionTableName
  )
  profile.actions = actions
}

/************************************
 * HTTP put method for insert object *
 *************************************/

app.put(path + '/:id', async (req, res) => {
  const id = req.params.id
  const estimate = req.body.estimate

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
})

/************************************
 * HTTP post method for insert object *
 *************************************/

app.post(path, async (req, res) => {
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
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
