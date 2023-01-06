import { aws_lambda_nodejs, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { BaseStackProps } from "./props";
import {
  LambdaIntegration,
  RestApi
} from "aws-cdk-lib/aws-apigateway";

export interface ApiGatewayStackProps extends BaseStackProps {
  itemLambda: aws_lambda_nodejs.NodejsFunction
  helloLambda: aws_lambda_nodejs.NodejsFunction
}

export class ApiGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, `${ props.stage }${ props.serviceName }apiGateway`, {
      restApiName: `${ props.stage }${ props.serviceName }apiGateway`,
    });
    const items = api.root.addResource("items");
    const hello = api.root.addResource("hello");
    const singleItem = items.addResource("{id}");
    const getItemIntegration = new LambdaIntegration(props.itemLambda);
    const getHelloIntegration = new LambdaIntegration(props.helloLambda);
    singleItem.addMethod("GET", getItemIntegration);
    hello.addMethod("GET", getHelloIntegration)
  }
}
