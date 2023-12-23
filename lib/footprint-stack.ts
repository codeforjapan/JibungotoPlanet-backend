import { aws_dynamodb, aws_lambda_nodejs, Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { BaseStackProps } from './props'
import { IFunction, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda'
import * as path from 'path'

export interface FootprintStackProps extends BaseStackProps {
  dynamoTable: aws_dynamodb.Table
}

export class FootprintStack extends Stack {
  public readonly lambda: IFunction

  constructor(scope: Construct, id: string, props: FootprintStackProps) {
    super(scope, id, props)

    this.lambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      'footprintFunction',
      {
        functionName: `${props.stage}${props.serviceName}footprintLambda`,
        entry: path.join(__dirname, './lambda/footprint.ts'),
        handler: 'handler',
        runtime: Runtime.NODEJS_18_X,
        environment: {
          TABLE_NAME: props.dynamoTable.tableName
        },
        tracing: Tracing.ACTIVE
      }
    )
    props.dynamoTable.grantReadData(this.lambda)
  }
}
