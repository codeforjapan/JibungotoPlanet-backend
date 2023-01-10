import {
  aws_certificatemanager,
  aws_route53,
  aws_route53_targets,
  RemovalPolicy,
  Stack
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { BaseStackProps } from "./props";
import {
  EndpointType,
  RestApi,
  SecurityPolicy
} from "aws-cdk-lib/aws-apigateway";

export interface Route53StackProps extends BaseStackProps {
  domain: string
  certificateArn: string
  api: RestApi
}

export class Route53Stack extends Stack {
  constructor(scope: Construct, id: string, props: Route53StackProps) {
    super(scope, id, props);

    const hostZone = aws_route53.HostedZone.fromLookup(this, 'Zone', { domainName: props.domain })
    props.api.addDomainName(`${ props.stage }${ props.serviceName }domain` , {
      domainName: `${ props.stage }-api-endpoint.${ props.domain }`,
      certificate: aws_certificatemanager.Certificate.fromCertificateArn(this, 'apiGateWayCertification', props.certificateArn),
      securityPolicy: SecurityPolicy.TLS_1_2,
      endpointType: EndpointType.REGIONAL
    }).addBasePathMapping(props.api, {
      basePath: props.stage,
    })

    new aws_route53.ARecord(this, 'addARecord', {
      zone: hostZone,
      target: aws_route53.RecordTarget.fromAlias(new aws_route53_targets.ApiGateway(props.api)),
      recordName: `${ props.stage }-api-endpoint`,
      deleteExisting: true
    }).applyRemovalPolicy(RemovalPolicy.DESTROY)

  }
}
