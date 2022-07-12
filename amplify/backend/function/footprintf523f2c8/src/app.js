/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	STORAGE_FOOTPRINT3UYVQUM6JRC4PF63CDE7NJSXEIDEV_ARN
	STORAGE_FOOTPRINT3UYVQUM6JRC4PF63CDE7NJSXEIDEV_NAME
	STORAGE_FOOTPRINT3UYVQUM6JRC4PF63CDE7NJSXEIDEV_STREAMARN
	STORAGE_FOOTPRINTEPWHHIO5ABGDTHPZPWFKAOX4BASTG_ARN
	STORAGE_FOOTPRINTEPWHHIO5ABGDTHPZPWFKAOX4BASTG_NAME
	STORAGE_FOOTPRINTEPWHHIO5ABGDTHPZPWFKAOX4BASTG_STREAMARN
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

const toComponent = (item) => {
  const dir_domain = item.dir_domain.split('_')
  const item_type = item.item_type.split('_')
  return {
    dir: dir_domain[0],
    domain: dir_domain[1],
    item: item_type[0],
    type: item_type[1],
    value: item.value,
    unit: item.unit,
    citation: item.citation
  }
}

AWS.config.update({ region: process.env.TABLE_REGION })

let suffix = '3uyvqum6jrc4pf63cde7njsxei-dev'
if (process.env.ENV && process.env.ENV !== 'NONE') {
  if (process.env.ENV === 'stg') {
    suffix = 'epwhhio5abgdthpzpwfkaox4ba-stg'
  }
}

let dynamoParam = {}
let tableName = 'Footprint-' + suffix

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
  tableName = 'FootprintTable'
}

const dynamodb = new AWS.DynamoDB.DocumentClient(dynamoParam)

const path = '/footprints'

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

/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path + '/:dir/:domain', async (req, res) => {
  const dir = req.params.dir
  const domain = req.params.domain

  const params = {
    TableName: tableName,
    KeyConditions: {
      dir_domain: {
        ComparisonOperator: 'EQ',
        AttributeValueList: [dir + '_' + domain]
      }
    }
  }

  try {
    const data = await dynamodb.query(params).promise()
    res.json(data.Items.map((item) => toComponent(item)))
  } catch (err) {
    res.statusCode = 500
    res.json({ error: 'Could not load items: ' + err })
  }
})

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/:dir/:domain/:item/:type', async (req, res) => {
  const dir = req.params.dir
  const domain = req.params.domain
  const item = req.params.item
  const type = req.params.type

  const params = {
    TableName: tableName,
    Key: {
      dir_domain: dir + '_' + domain,
      item_type: item + '_' + type
    }
  }

  try {
    const data = await dynamodb.get(params).promise()
    res.json(toComponent(data.Item))
  } catch (err) {
    res.statusCode = 500
    res.json({ error: 'Could not load items: ' + err.message })
  }
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
