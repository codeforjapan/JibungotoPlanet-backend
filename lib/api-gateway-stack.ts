import { aws_certificatemanager, Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { BaseStackProps } from './props'
import {
  BasePathMapping,
  Cors,
  DomainName,
  EndpointType,
  IDomainName,
  LambdaIntegration,
  RestApi,
  SecurityPolicy
} from 'aws-cdk-lib/aws-apigateway'
import { IFunction } from 'aws-cdk-lib/aws-lambda'

export interface ApiGatewayStackProps extends BaseStackProps {
  domain: string
  certificateArn: string
  helloLambda: IFunction
  authHelloLambda: IFunction
  footprintLambda: IFunction
  shareLambda: IFunction
  profileLambda: IFunction
  authProfileLambda: IFunction
}

export class ApiGatewayStack extends Stack {
  public readonly api: IDomainName

  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props)

    const apiGateway = new RestApi(
      this,
      `${props.stage}${props.serviceName}apiGateway`,
      {
        restApiName: `${props.stage}${props.serviceName}apiGateway`,
        deployOptions: {
          tracingEnabled: true,
          metricsEnabled: true,
          stageName: props.stage
        },
        endpointTypes: [EndpointType.REGIONAL],
        defaultCorsPreflightOptions: {
          allowOrigins: Cors.ALL_ORIGINS,
          allowMethods: Cors.ALL_METHODS,
          allowHeaders: Cors.DEFAULT_HEADERS,
          statusCode: 200
        }
      }
    )

    const hello = apiGateway.root.addResource('hello')

    // memo replaceに向けて個別でルーティングする
    const footprint = apiGateway.root.addResource('footprints')
    const footprintDir = footprint.addResource('{dir}')
    const footprintDomain = footprintDir.addResource('{domain}')
    const footprintType = footprintDomain
      .addResource('{item}')
      .addResource('{type}')

    const share = apiGateway.root.addResource('shares')
    const shareId = share.addResource('{id}')

    const profile = apiGateway.root.addResource('profiles')
    const profileId = profile.addResource('{id}')

    // auth routes
    const auth = apiGateway.root.addResource('auth')
    const authHello = auth.addResource('hello')
    const authProfile = auth.addResource('profiles')
    const authProfileId = authProfile.addResource('{id}')

    const getHelloIntegration = new LambdaIntegration(props.helloLambda)
    const footprintIntegration = new LambdaIntegration(props.footprintLambda)
    const shareIntegration = new LambdaIntegration(props.shareLambda)
    const profileIntegration = new LambdaIntegration(props.profileLambda)

    const getAuthHelloIntegration = new LambdaIntegration(props.authHelloLambda)
    const authProfileIntegration = new LambdaIntegration(props.authProfileLambda)

    hello.addMethod('GET', getHelloIntegration)
    footprintDir.addMethod('GET', footprintIntegration)
    footprintDomain.addMethod('GET', footprintIntegration)
    footprintType.addMethod('GET', footprintIntegration)
    shareId.addMethod('GET', shareIntegration)
    profile.addMethod('POST', profileIntegration)
    profileId.addMethod('GET', profileIntegration)
    profileId.addMethod('PUT', profileIntegration)
    authHello.addMethod('GET', getAuthHelloIntegration)
    authProfileId.addMethod('GET', authProfileIntegration)
    authProfileId.addMethod('PUT', authProfileIntegration)
    authProfile.addMethod('POST', authProfileIntegration)

    const domain = new DomainName(
      this,
      `${props.stage}${props.serviceName}domain`,
      {
        certificate: aws_certificatemanager.Certificate.fromCertificateArn(
          this,
          'apiGateWayCertification',
          props.certificateArn
        ),
        domainName: `${props.stage}-api-endpoint.${props.domain}`,
        securityPolicy: SecurityPolicy.TLS_1_2,
        endpointType: EndpointType.REGIONAL
      }
    )
    new BasePathMapping(
      this,
      `${props.stage}${props.serviceName}firstPathMapping`,
      {
        domainName: domain,
        restApi: apiGateway,
        basePath: ''
      }
    )
    new BasePathMapping(this, `${props.stage}${props.serviceName}PathMapping`, {
      domainName: domain,
      restApi: apiGateway,
      basePath: props.stage
    })
    this.api = domain
  }
}
