/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_PROFILE3UYVQUM6JRC4PF63CDE7NJSXEIDEV_ARN
	STORAGE_PROFILE3UYVQUM6JRC4PF63CDE7NJSXEIDEV_NAME
	STORAGE_PROFILE3UYVQUM6JRC4PF63CDE7NJSXEIDEV_STREAMARN
	STORAGE_PROFILEEPWHHIO5ABGDTHPZPWFKAOX4BASTG_ARN
	STORAGE_PROFILEEPWHHIO5ABGDTHPZPWFKAOX4BASTG_NAME
	STORAGE_PROFILEEPWHHIO5ABGDTHPZPWFKAOX4BASTG_STREAMARN
	STORAGE_PROFILEZ6DHUM3EDRGFPB2GC4MMJDEXPUPRD_ARN
	STORAGE_PROFILEZ6DHUM3EDRGFPB2GC4MMJDEXPUPRD_NAME
	STORAGE_PROFILEZ6DHUM3EDRGFPB2GC4MMJDEXPUPRD_STREAMARN
Amplify Params - DO NOT EDIT */ /*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
const express = require('express')

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
let tableName = 'Profile-' + suffix

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
  tableName = 'ProfileTable'
}

const dynamodb = new AWS.DynamoDB.DocumentClient(dynamoParam)

const path = '/shares'

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

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/:id', async (req, res) => {
  const id = req.params.id
  const params = {
    TableName: tableName,
    IndexName: 'profilesByShareId',
    KeyConditionExpression: 'shareId = :shareId',
    ExpressionAttributeValues: { ':shareId': id }
  }

  try {
    const data = await dynamodb.query(params).promise()
    const item = data.Items[0]
    if (item) {
      if (item.estimated) {
        const profile = {
          shareId: item.shareId,
          actionIntensityRates: item.actionIntensityRates,
          baselines: item.baselines,
          estimations: item.estimations,
          actions: item.actions
        }
        res.json(profile)
      } else {
        res.statusCode = 404
        res.json({})
      }
    } else {
      res.json({})
    }
  } catch (err) {
    res.statusCode = 500
    res.json({ error: 'Could not load item: ' + err })
  }
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
