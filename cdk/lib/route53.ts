import {
  aws_route53,
  aws_route53_targets,
  RemovalPolicy,
  Stack
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { BaseStackProps } from "./props";
import {
  IDomainName,
} from "aws-cdk-lib/aws-apigateway";

export interface Route53StackProps extends BaseStackProps {
  domain: string
  api: IDomainName
}

export class Route53Stack extends Stack {
  constructor(scope: Construct, id: string, props: Route53StackProps) {
    super(scope, id, props);

    const hostZone = aws_route53.HostedZone.fromLookup(this, 'Zone', { domainName: props.domain })

    new aws_route53.ARecord(this, 'addARecord', {
      zone: hostZone,
      target: aws_route53.RecordTarget.fromAlias(new aws_route53_targets.ApiGatewayDomain(props.api)),
      recordName: `${ props.stage }-api-endpoint`,
      deleteExisting: true
    }).applyRemovalPolicy(RemovalPolicy.DESTROY)

  }
}
