import { aws_dynamodb, aws_lambda_nodejs, Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { BaseStackProps } from './props'
import { IFunction, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda'
import * as path from 'path'

export interface Web3StackProps extends BaseStackProps {
  footprintTable: aws_dynamodb.Table
  profileTable: aws_dynamodb.Table
  parameterTable: aws_dynamodb.Table
  optionTable: aws_dynamodb.Table
  usersTable: aws_dynamodb.Table
}

export class Web3Stack extends Stack {
  public readonly authIntegrateWalletLambda: IFunction

  constructor(scope: Construct, id: string, props: Web3StackProps) {
    super(scope, id, props)

    this.authIntegrateWalletLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      'authWeb3Function',
      {
        functionName: `${props.stage}${props.serviceName}authIntegrateWalletLambda`,
        entry: path.join(__dirname, './lambda/auth/integrate-wallet.ts'),
        handler: 'handler',
        runtime: Runtime.NODEJS_16_X,
        environment: {
          FOOTPRINT_TABLE_NAME: props.footprintTable.tableName,
          PARAMETER_TABLE_NAME: props.parameterTable.tableName,
          PROFILE_TABLE_NAME: props.profileTable.tableName,
          OPTION_TABLE_NAME: props.optionTable.tableName,
          USERS_TABLE_NAME: props.usersTable.tableName
        },
        tracing: Tracing.ACTIVE
      }
    )

    props.usersTable.grantReadWriteData(this.authIntegrateWalletLambda)
  }
}
