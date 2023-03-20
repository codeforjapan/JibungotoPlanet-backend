import { ethers } from 'ethers'
import Web3 from 'web3'

const ActionHistoryAbi = require('../../abi/ActionHistory.json')

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

const path = '/web3'

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
  const web3 = new Web3(process.env.JSON_RPC_PROVIDER!)
  try {
    const { Items: users } = await dynamodb
      .scan({
        TableName: usersTableName
      })
      .promise()
    for (const user of users) {
      try {
        if (!user.wallet_address) continue
        const networkId = await web3.eth.net.getId()

        const contract = new web3.eth.Contract(
          ActionHistoryAbi.abi,
          process.env.ACTION_HISTORY_ADDR!
        )

        web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY!)
        const walletAddress = web3.eth.accounts.privateKeyToAccount(
          process.env.PRIVATE_KEY!
        )

        const metadata = {
          answerAll: true,
          housing: 100,
          food: 100,
          mobility: 100,
          other: 100
        }
        const encodedParam = web3.eth.abi.encodeParameter(
          {
            RequiredMetadata: {
              answerAll: 'bool',
              housing: 'uint8',
              food: 'uint8',
              mobility: 'uint8',
              other: 'uint8'
            }
          },
          metadata
        )

        const tx = contract.methods.register({
          owner: user.wallet_address,
          secretary: walletAddress.address,
          actionId: 1,
          standardMetadata: encodedParam,
          optionalMetadata: '',
          status: 1
        })

        const gas = await tx.estimateGas({
          from: walletAddress.address
        })
        const gasPrice = Number(await web3.eth.getGasPrice())
        const data = tx.encodeABI()
        const nonce = await web3.eth.getTransactionCount(walletAddress.address)

        const signedTx = await web3.eth.accounts.signTransaction(
          {
            to: contract.options.address,
            data,
            gas,
            gasPrice,
            nonce,
            chainId: networkId
          },
          process.env.PRIVATE_KEY!
        )

        await web3.eth.sendSignedTransaction(signedTx.rawTransaction || '')
      } catch (error) {
        continue
      }
    }
    const networkId = await web3.eth.net.getId()
    res.json({ status: 'success', networkId })
  } catch (err) {
    res.statusCode = 500
    res.json({ error: err, url: req.url, body: req.body })
  }
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
export default app
