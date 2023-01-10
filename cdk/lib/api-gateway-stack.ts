import {
  aws_lambda_nodejs,
  Stack
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { BaseStackProps } from "./props";
import {
  EndpointType,
  LambdaIntegration,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";

export interface ApiGatewayStackProps extends BaseStackProps {
  helloLambda: aws_lambda_nodejs.NodejsFunction
  footprintLambda: aws_lambda_nodejs.NodejsFunction
  shareLambda: aws_lambda_nodejs.NodejsFunction
  profileLambda: aws_lambda_nodejs.NodejsFunction
}

export class ApiGatewayStack extends Stack {
  public readonly api: RestApi

  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);

    this.api = new RestApi(this, `${ props.stage }${ props.serviceName }apiGateway`, {
      restApiName: `${ props.stage }${ props.serviceName }apiGateway`,
      deployOptions: {
        tracingEnabled: true,
        metricsEnabled: true,
        stageName: props.stage
      },
      endpointTypes: [EndpointType.REGIONAL]
    });

    const hello = this.api.root.addResource("hello");

    // memo replaceに向けて個別でルーティングする
    const footprint = this.api.root.addResource("footprints",)
    const footprintDir = footprint.addResource("{dir}");
    const footprintDomain = footprintDir.addResource("{domain}");
    const footprintType = footprintDomain.addResource("{item}").addResource("{type}");

    const share = this.api.root.addResource("shares",)
    const shareId = share.addResource("{id}");

    const profile = this.api.root.addResource("profiles")
    const profileId = profile.addResource("{id}");

    const getHelloIntegration = new LambdaIntegration(props.helloLambda);
    const footprintIntegration = new LambdaIntegration(props.footprintLambda);
    const shareIntegration = new LambdaIntegration(props.shareLambda);
    const profileIntegration = new LambdaIntegration(props.profileLambda);

    hello.addMethod("GET", getHelloIntegration)
    footprintDir.addMethod("GET", footprintIntegration)
    footprintDomain.addMethod("GET", footprintIntegration)
    footprintType.addMethod("GET", footprintIntegration)
    shareId.addMethod("GET", shareIntegration)
    profile.addMethod("POST", profileIntegration)
    profileId.addMethod("GET", profileIntegration)
    profileId.addMethod("PUT", profileIntegration)
  }
}
