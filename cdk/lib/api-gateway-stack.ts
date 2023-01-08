import {
  aws_certificatemanager,
  aws_lambda_nodejs,
  aws_route53,
  aws_route53_targets,
  RemovalPolicy,
  Stack
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { BaseStackProps } from "./props";
import {
  EndpointType,
  LambdaIntegration,
  RestApi,
  SecurityPolicy
} from "aws-cdk-lib/aws-apigateway";

export interface ApiGatewayStackProps extends BaseStackProps {
  domain: string
  certificateArn: string
  helloLambda: aws_lambda_nodejs.NodejsFunction
  footprintLambda: aws_lambda_nodejs.NodejsFunction
  shareLambda: aws_lambda_nodejs.NodejsFunction
  profileLambda: aws_lambda_nodejs.NodejsFunction
}

export class ApiGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, `${ props.stage }${ props.serviceName }apiGateway`, {
      restApiName: `${ props.stage }${ props.serviceName }apiGateway`,
      deployOptions: {
        tracingEnabled: true,
        metricsEnabled: true,
        stageName: props.stage
      },
      endpointTypes: [EndpointType.REGIONAL]
    });

    const hello = api.root.addResource("hello");

    // memo replaceに向けて個別でルーティングする
    const footprint = api.root.addResource("footprints",)
    const footprintDir = footprint.addResource("{dir}");
    const footprintDomain = footprintDir.addResource("{domain}");
    const footprintType = footprintDomain.addResource("{item}").addResource("{type}");

    const share = api.root.addResource("shares",)
    const shareId = share.addResource("{id}");

    const profile = api.root.addResource("profiles")
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

    const hostZone = aws_route53.HostedZone.fromLookup(this, 'Zone', { domainName: props.domain })
    api.addDomainName(`${ props.stage }${ props.serviceName }domain` , {
      domainName: `${ props.stage }-api-endpoint.${ props.domain }`,
      certificate: aws_certificatemanager.Certificate.fromCertificateArn(this, 'apiGateWayCertification', props.certificateArn),
      securityPolicy: SecurityPolicy.TLS_1_2,
      endpointType: EndpointType.REGIONAL
    }).addBasePathMapping(api, {
      basePath: props.stage,
    })

    new aws_route53.ARecord(this, 'addARecord', {
      zone: hostZone,
      target: aws_route53.RecordTarget.fromAlias(new aws_route53_targets.ApiGateway(api)),
      recordName: `${ props.stage }-api-endpoint`,
      deleteExisting: true
    }).applyRemovalPolicy(RemovalPolicy.DESTROY)

  }
}
