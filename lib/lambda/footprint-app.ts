const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
import express from 'express'

const TABLE_NAME = process.env.TABLE_NAME || ''
const MOCK = process.env.LOCALSTACK_HOSTNAME === 'localhost' || false

const toComponent = (item: any) => {
  const dir_domain = item.dir_domain.split('_')
  const item_type = item.item_type.split('_')
  return {
    dir: dir_domain[0],
    domain: dir_domain[1],
    item: item_type[0],
    type: item_type[1],
    subdomain: item.subdomain,
    value: item.value,
    unit: item.unit,
    citation: item.citation
  }
}

let dynamoParam = {}
let tableName = TABLE_NAME

if (MOCK) {
  // for local mock
  dynamoParam = {
    endpoint: 'http://localhost:4566',
    region: 'ap-northeast-1',
    accessKeyId: 'testUser',
    secretAccessKey: 'testAccessKey'
  }
  tableName = 'localJibungotoPlanetfootprint'
}

const dynamodb = new AWS.DynamoDB.DocumentClient(dynamoParam)

const path = '/footprints'

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

/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path + '/:dir', async (req: express.Request, res: express.Response) => {
  const dir = req.params.dir
  let response: any[] = []

  // domainは決めうちで設定
  for (const domain of ['housing', 'mobility', 'food', 'other']) {
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
      response = response.concat(
        data.Items.map((item: any) => toComponent(item))
      )
    } catch (err) {
      res.statusCode = 500
      res.json({ error: 'Could not load dir: ' + err })
    }
  }

  if (res.statusCode !== 500) {
    res.json(response)
  }
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
    res.json(data.Items.map((item: any) => toComponent(item)))
  } catch (err) {
    res.statusCode = 500
    res.json({ error: 'Could not load domain: ' + err })
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
  } catch (err: any) {
    res.statusCode = 500
    res.json({ error: 'Could not load item & type: ' + err.message })
  }
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
export default app
