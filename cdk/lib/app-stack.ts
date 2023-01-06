import { aws_dynamodb, aws_lambda_nodejs, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { BaseStackProps } from "./props";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  LambdaIntegration,
  RestApi
} from "aws-cdk-lib/aws-apigateway";
import * as path from "path";

export interface AppStackProps extends BaseStackProps {
  dynamoTable: aws_dynamodb.Table
}

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    const getItemLambda = new aws_lambda_nodejs.NodejsFunction(this, "getOneItemFunction", {
      functionName: `${ props.stage }${ props.serviceName }itemLambda`,
      entry: path.join(__dirname, './lambda/item.ts'),
      handler: "handler",
      runtime: Runtime.NODEJS_16_X,
      environment: {
        TABLE_NAME: props.dynamoTable.tableName,
        PRIMARY_KEY: "itemId",
      },
    })
    const getHelloLambda = new aws_lambda_nodejs.NodejsFunction(this, "getHelloFunction", {
      functionName: `${ props.stage }${ props.serviceName }helloLambda`,
      entry: path.join(__dirname, './lambda/hello.ts'),
      handler: "handler",
      runtime: Runtime.NODEJS_16_X,
    })

    props.dynamoTable.grantReadData(getItemLambda);

    const api = new RestApi(this, `${ props.stage }${ props.serviceName }apiGateway`, {
      restApiName: `${ props.stage }${ props.serviceName }apiGateway`,
    });
    const items = api.root.addResource("items");
    const hello = api.root.addResource("hello");
    const singleItem = items.addResource("{id}");
    const getItemIntegration = new LambdaIntegration(getItemLambda);
    const getHelloIntegration = new LambdaIntegration(getHelloLambda);
    singleItem.addMethod("GET", getItemIntegration);
    hello.addMethod("GET", getHelloIntegration)
  }
}
