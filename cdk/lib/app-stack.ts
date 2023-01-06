import { aws_dynamodb, aws_lambda_nodejs, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { BaseStackProps } from "./props";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export interface AppStackProps extends BaseStackProps {
  dynamoTable: aws_dynamodb.Table
}

export class AppStack extends Stack {
  public readonly itemLambda: NodejsFunction
  public readonly helloLambda: NodejsFunction

  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    this.itemLambda = new aws_lambda_nodejs.NodejsFunction(this, "getOneItemFunction", {
      functionName: `${ props.stage }${ props.serviceName }itemLambda`,
      entry: path.join(__dirname, './lambda/item.ts'),
      handler: "handler",
      runtime: Runtime.NODEJS_16_X,
      environment: {
        TABLE_NAME: props.dynamoTable.tableName,
        PRIMARY_KEY: "itemId",
      },
    })

    this.helloLambda = new aws_lambda_nodejs.NodejsFunction(this, "getHelloFunction", {
      functionName: `${ props.stage }${ props.serviceName }helloLambda`,
      entry: path.join(__dirname, './lambda/hello.ts'),
      handler: "handler",
      runtime: Runtime.NODEJS_16_X,
    })

    props.dynamoTable.grantReadData(this.itemLambda);
  }
}
