import { aws_dynamodb, aws_lambda_nodejs, Duration, Stack } from 'aws-cdk-lib'
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
  web3: {
    jsonRpcProvider: string
    actionHistoryAddr: string
    privateKey: string
  }
}

export class Web3Stack extends Stack {
  public readonly web3Lambda: IFunction
  public readonly authIntegrateWalletLambda: IFunction

  constructor(scope: Construct, id: string, props: Web3StackProps) {
    super(scope, id, props)

    this.web3Lambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      'web3Function',
      {
        functionName: `${props.stage}${props.serviceName}web3Lambda`,
        entry: path.join(__dirname, './lambda/web3.ts'),
        handler: 'handler',
        runtime: Runtime.NODEJS_16_X,
        timeout: Duration.seconds(20),
        environment: {
          FOOTPRINT_TABLE_NAME: props.footprintTable.tableName,
          PARAMETER_TABLE_NAME: props.parameterTable.tableName,
          PROFILE_TABLE_NAME: props.profileTable.tableName,
          OPTION_TABLE_NAME: props.optionTable.tableName,
          USERS_TABLE_NAME: props.usersTable.tableName,
          PRIVATE_KEY: props.web3.privateKey,
          ACTION_HISTORY_ADDR: props.web3.actionHistoryAddr,
          JSON_RPC_PROVIDER: props.web3.jsonRpcProvider
        },
        tracing: Tracing.ACTIVE
      }
    )

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
    props.usersTable.grantReadData(this.web3Lambda)
  }
}
