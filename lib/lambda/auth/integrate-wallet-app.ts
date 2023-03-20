import { ethers } from 'ethers'

const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
import express from 'express'

const FOOTPRINT_TABLE_NAME = process.env.FOOTPRINT_TABLE_NAME || ''
const PARAMETER_TABLE_NAME = process.env.PARAMETER_TABLE_NAME || ''
const PROFILE_TABLE_NAME = process.env.PROFILE_TABLE_NAME || ''
const OPTION_TABLE_NAME = process.env.OPTION_TABLE_NAME || ''
const USERS_TABLE_NAME = process.env.USERS_TABLE_NAME || ''
const MOCK = !!process.env.LOCALSTACK_HOSTNAME

let dynamoParam = {}
let footprintTableName = FOOTPRINT_TABLE_NAME
let parameterTableName = PARAMETER_TABLE_NAME
let profileTableName = PROFILE_TABLE_NAME
let optionTableName = OPTION_TABLE_NAME
let usersTableName = USERS_TABLE_NAME

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
  usersTableName = 'localJibungotoPlanetusers'
}

const dynamodb = new AWS.DynamoDB.DocumentClient(dynamoParam)

const path = '/auth/integrate-wallet'

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

app.get(path, async (req: express.Request, res: express.Response) => {
  try {
    const { Item: user } = await dynamodb
      .get({
        TableName: usersTableName,
        Key: { user_id: req.query.user_id }
      })
      .promise()
    res.json(user)
  } catch (err) {
    res.statusCode = 500
    res.json({ error: err, url: req.url, body: req.body })
  }
})

app.post(path, async (req: express.Request, res: express.Response) => {
  try {
    const {
      signature,
      message,
      user_id
    }: { signature: string; message: string; user_id: string } = req.body
    const digest = ethers.hashMessage(message)
    const wallet_address = ethers.recoverAddress(digest, signature)

    await dynamodb
      .put({
        TableName: usersTableName,
        Item: { user_id: user_id, wallet_address }
      })
      .promise()
    res.json({ wallet_address })
  } catch (err) {
    res.statusCode = 500
    res.json({ error: err, url: req.url, body: req.body })
  }
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
export default app
