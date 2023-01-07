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
  footprintLambda: aws_lambda_nodejs.NodejsFunction
  shareLambda: aws_lambda_nodejs.NodejsFunction
}

export class ApiGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, `${ props.stage }${ props.serviceName }apiGateway`, {
      restApiName: `${ props.stage }${ props.serviceName }apiGateway`,
      deployOptions: {
        tracingEnabled: true,
        metricsEnabled: true,
      },
    });
    const items = api.root.addResource("items");
    const singleItem = items.addResource("{id}");

    const hello = api.root.addResource("hello");

    // memo replaceに向けて個別でルーティングする
    const footprint = api.root.addResource("footprints",)
    const footprintDir = footprint.addResource("{dir}");
    const footprintDomain = footprintDir.addResource("{domain}");
    const footprintType = footprintDomain.addResource("{item}").addResource("{type}");

    const share = api.root.addResource("shares",)
    const shareId = share.addResource("{id}");

    const getItemIntegration = new LambdaIntegration(props.itemLambda);
    const getHelloIntegration = new LambdaIntegration(props.helloLambda);
    const footprintIntegration = new LambdaIntegration(props.footprintLambda);
    const shareIntegration = new LambdaIntegration(props.shareLambda);

    singleItem.addMethod("GET", getItemIntegration);
    hello.addMethod("GET", getHelloIntegration)
    footprintDir.addMethod("GET", footprintIntegration)
    footprintDomain.addMethod("GET", footprintIntegration)
    footprintType.addMethod("GET", footprintIntegration)
    shareId.addMethod("GET", shareIntegration)
  }
}
