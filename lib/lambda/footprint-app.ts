const AWS = require('aws-sdk')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const bodyParser = require('body-parser')
import { enumerateBaselines } from 'cfp-calc'
import express from 'express'
import { toFootprint } from './utils/adapter'

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

  try {
    // baseline 取得に決めうち
    response = response.concat(
      enumerateBaselines().map((item: any) => toFootprint(item))
    )
  } catch (err) {
    res.statusCode = 500
    res.json({ error: 'Could not load dir: ' + err })
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

  try {
    // baseline 取得に決めうち
    const data = enumerateBaselines().filter((bl: any) => bl.domain === domain)
    res.json(data.map((item: any) => toFootprint(item)))
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

  try {
    // baseline 取得に決めうち
    const data = enumerateBaselines().filter(
      (bl) => bl.domain === domain && bl.item === item && bl.type === type
    )
    res.json(toFootprint(data[0]))
  } catch (err: any) {
    res.statusCode = 500
    res.json({ error: 'Could not load item & type: ' + err.message })
  }
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
export default app
