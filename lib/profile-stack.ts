import { aws_dynamodb, aws_lambda_nodejs, Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { BaseStackProps } from './props'
import { IFunction, Runtime, Tracing } from 'aws-cdk-lib/aws-lambda'
import * as path from 'path'

export interface ProfileStackProps extends BaseStackProps {
  footprintTable: aws_dynamodb.Table
  profileTable: aws_dynamodb.Table
  parameterTable: aws_dynamodb.Table
  optionTable: aws_dynamodb.Table
  usersTable: aws_dynamodb.Table
}

export class ProfileStack extends Stack {
  public readonly lambda: IFunction
  public readonly authLambda: IFunction

  constructor(scope: Construct, id: string, props: ProfileStackProps) {
    super(scope, id, props)

    this.lambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      'profileFunction',
      {
        functionName: `${props.stage}${props.serviceName}profileLambda`,
        entry: path.join(__dirname, './lambda/profile.ts'),
        handler: 'handler',
        runtime: Runtime.NODEJS_16_X,
        environment: {
          FOOTPRINT_TABLE_NAME: props.footprintTable.tableName,
          PARAMETER_TABLE_NAME: props.parameterTable.tableName,
          PROFILE_TABLE_NAME: props.profileTable.tableName,
          OPTION_TABLE_NAME: props.optionTable.tableName
        },
        tracing: Tracing.ACTIVE
      }
    )

    this.authLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      'authProfileFunction',
      {
        functionName: `${props.stage}${props.serviceName}authProfileLambda`,
        entry: path.join(__dirname, './lambda/auth/profile.ts'),
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

    props.footprintTable.grantReadData(this.lambda)
    props.parameterTable.grantReadData(this.lambda)
    props.optionTable.grantReadData(this.lambda)
    props.profileTable.grantReadWriteData(this.lambda)

    props.footprintTable.grantReadData(this.authLambda)
    props.parameterTable.grantReadData(this.authLambda)
    props.optionTable.grantReadData(this.authLambda)
    props.profileTable.grantReadWriteData(this.authLambda)
    props.usersTable.grantReadWriteData(this.authLambda)
  }
}
