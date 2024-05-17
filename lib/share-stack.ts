import { aws_dynamodb, aws_lambda_nodejs, Duration, Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { BaseStackProps } from './props'
import { IFunction, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda'
import * as path from 'path'

export interface ShareStackProps extends BaseStackProps {
  dynamoTable: aws_dynamodb.Table
}

export class ShareStack extends Stack {
  public readonly lambda: IFunction

  constructor(scope: Construct, id: string, props: ShareStackProps) {
    super(scope, id, props)

    this.lambda = new aws_lambda_nodejs.NodejsFunction(this, 'ShareFunction', {
      functionName: `${props.stage}${props.serviceName}shareLambda`,
      entry: path.join(__dirname, './lambda/share.ts'),
      handler: 'handler',
      runtime: Runtime.NODEJS_18_X,
      environment: {
        TABLE_NAME: props.dynamoTable.tableName
      },
      tracing: Tracing.ACTIVE,
      timeout: Duration.seconds(10)
    })
    props.dynamoTable.grantReadData(this.lambda)
  }
}
