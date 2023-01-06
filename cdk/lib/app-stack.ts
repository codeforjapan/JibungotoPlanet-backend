import { aws_lambda_nodejs, RemovalPolicy, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { BaseStackProps } from "./props";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  LambdaIntegration,
  RestApi
} from "aws-cdk-lib/aws-apigateway";
import * as path from "path";

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: BaseStackProps) {
    super(scope, id, props);

    const dynamoTable = new Table(this, "items", {
      partitionKey: {
        name: "itemId",
        type: AttributeType.STRING
      },
      tableName: 'items',
      removalPolicy: RemovalPolicy.DESTROY
    })

    const getItemLambda = new aws_lambda_nodejs.NodejsFunction(this, "getOneItemFunction", {
      functionName: `${ props.stage }${ props.serviceName }itemLambda`,
      entry: path.join(__dirname, './lambda/item.ts'),
      handler: "handler",
      runtime: Runtime.NODEJS_16_X,
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: "itemId",
      },
    })
    const getHelloLambda = new aws_lambda_nodejs.NodejsFunction(this, "getHelloFunction", {
      functionName: `${ props.stage }${ props.serviceName }helloLambda`,
      entry: path.join(__dirname, './lambda/hello.ts'),
      handler: "handler",
      runtime: Runtime.NODEJS_16_X,
    })

    dynamoTable.grantReadData(getItemLambda);

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
