const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
import express from 'express'

const TABLE_NAME = process.env.TABLE_NAME || ''
const MOCK = process.env.LOCALSTACK_HOSTNAME ? true : false

let dynamoParam = {}
let tableName = TABLE_NAME

if (MOCK) {
  // for mock and localstack
  dynamoParam = {
    endpoint: `http://${process.env.LOCALSTACK_HOSTNAME}:4566`,
    region: 'ap-northeast-1',
    accessKeyId: 'testUser',
    secretAccessKey: 'testAccessKey'
  }
  tableName = 'localJibungotoPlanetprofile'
}

const dynamodb = new AWS.DynamoDB.DocumentClient(dynamoParam)

const path = '/shares'

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

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + '/:id', async (req: express.Request, res: express.Response) => {
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
export default app
