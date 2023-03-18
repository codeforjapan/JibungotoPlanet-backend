import { aws_certificatemanager, aws_lambda_nodejs, Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { BaseStackProps } from './props'
import {
  BasePathMapping,
  Cors,
  DomainName,
  EndpointType,
  IdentitySource,
  IDomainName,
  LambdaIntegration,
  RestApi,
  SecurityPolicy,
  TokenAuthorizer
} from 'aws-cdk-lib/aws-apigateway'
import { IFunction, Runtime } from 'aws-cdk-lib/aws-lambda'
import path from 'path'

export interface ApiGatewayStackProps extends BaseStackProps {
  domain: string
  certificateArn: string
  helloLambda: IFunction
  authHelloLambda: IFunction
  authIntegrateWalletLambda: IFunction
  footprintLambda: IFunction
  shareLambda: IFunction
  profileLambda: IFunction
  authProfileLambda: IFunction
  audience: string
  jwksUri: string
  tokenIssuer: string
}

export class ApiGatewayStack extends Stack {
  public readonly api: IDomainName

  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props)

    const authorizerLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      'lambdaAuthorizerFunction',
      {
        functionName: `${props.stage}${props.serviceName}Authorizer`,
        entry: path.join(__dirname, './lambda/authorizer.ts'),
        handler: 'handler',
        runtime: Runtime.NODEJS_16_X,
        environment: {
          AUDIENCE: props.audience,
          JWKS_URI: props.jwksUri,
          TOKEN_ISSUER: props.tokenIssuer
        }
      }
    )

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

    const lambdaAuth =
      props.stage !== 'local'
        ? new TokenAuthorizer(this, 'lambdaAuthorizer', {
            authorizerName: 'lambdaAuthorizer',
            handler: authorizerLambda, //ここでLambda Authorizer用のLambda関数を割り当てる
            identitySource: IdentitySource.header('Authorization') //アクセストークンを渡すためのヘッダーを指定
          })
        : undefined

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
    const authIntegrateWallet = auth.addResource('integrate-wallet')
    const authProfile = auth.addResource('profiles')
    const authProfileId = authProfile.addResource('{id}')

    const getHelloIntegration = new LambdaIntegration(props.helloLambda)
    const footprintIntegration = new LambdaIntegration(props.footprintLambda)
    const shareIntegration = new LambdaIntegration(props.shareLambda)
    const profileIntegration = new LambdaIntegration(props.profileLambda)

    const getAuthHelloIntegration = new LambdaIntegration(props.authHelloLambda)
    const authIntegrateWalletIntegration = new LambdaIntegration(
      props.authIntegrateWalletLambda
    )
    const authProfileIntegration = new LambdaIntegration(
      props.authProfileLambda
    )

    hello.addMethod('GET', getHelloIntegration)
    footprintDir.addMethod('GET', footprintIntegration)
    footprintDomain.addMethod('GET', footprintIntegration)
    footprintType.addMethod('GET', footprintIntegration)
    shareId.addMethod('GET', shareIntegration)
    profile.addMethod('POST', profileIntegration)
    profileId.addMethod('GET', profileIntegration)
    profileId.addMethod('PUT', profileIntegration)
    authHello.addMethod('GET', getAuthHelloIntegration, {
      authorizer: lambdaAuth
    })
    authIntegrateWallet.addMethod('GET', authIntegrateWalletIntegration)
    authIntegrateWallet.addMethod('POST', authIntegrateWalletIntegration)
    authProfileId.addMethod('GET', authProfileIntegration, {
      authorizer: lambdaAuth
    })
    authProfileId.addMethod('PUT', authProfileIntegration, {
      authorizer: lambdaAuth
    })
    authProfile.addMethod('POST', authProfileIntegration, {
      authorizer: lambdaAuth
    })

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
