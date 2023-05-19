const awsServerlessExpress = require('aws-serverless-express')
import app from './profile-app'

app.listen(3000, function () {
  console.log('App started')
})

/**
 * @type {import('http').Server}
 */
const server = awsServerlessExpress.createServer(app)

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = (event: any = {}, context: any = {}) => {
  console.log(`EVENT: ${JSON.stringify(event)}`)
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise
}
