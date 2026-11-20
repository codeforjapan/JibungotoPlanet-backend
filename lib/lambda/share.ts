import serverlessExpress from '@codegenie/serverless-express'
import app from './share-app'

const serverlessExpressHandler = serverlessExpress({ app })

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = (event: any = {}, context: any = {}) => {
  console.log(`EVENT: ${JSON.stringify(event)}`)
  // 型定義は callback 付きの Handler 型だが、実装は (event, context) だけを使い Promise を返す
  return serverlessExpressHandler(event, context, () => {})
}
