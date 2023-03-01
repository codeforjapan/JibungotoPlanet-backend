#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Config, getConfig } from '../lib/config';
import { AppStack } from "../lib/app-stack";
import { DynamodbStack } from "../lib/dynamodb-stack";
import { ApiGatewayStack } from "../lib/api-gateway-stack";
import { FootprintStack } from "../lib/footprint-stack";
import { ShareStack } from "../lib/share-stack";
import { ProfileStack } from "../lib/profile-stack";
import { Tags } from 'aws-cdk-lib';
import { Route53Stack } from "../lib/route53";

const app = new cdk.App();

const stages = ['local', 'dev', 'prd']
const stage = app.node.tryGetContext('stage')
if (!stages.includes(stage)) {
  throw new Error('set stage value using -c option')
}

const config: Config = getConfig(stage)
const serviceName = 'JibungotoPlanet'

const env = {
  account: config.aws.accountId,
  region: config.aws.region
}

const dynamoDB = new DynamodbStack(app, `${ stage }${ serviceName }DynamoDBStack`, {
  stage,
  env,
  serviceName
})

const lambda = new AppStack(app, `${ stage }${ serviceName }AppStack`, {
  stage,
  env,
  serviceName,
  dynamoTable: dynamoDB.itemTable
})
lambda.addDependency(dynamoDB)

const footprintLambda = new FootprintStack(app, `${ stage }${ serviceName }FootprintStack`, {
  stage,
  env,
  serviceName,
  dynamoTable: dynamoDB.footprintTable
})
footprintLambda.addDependency(dynamoDB)

const shareLambda = new ShareStack(app, `${ stage }${ serviceName }ShareStack`, {
  stage,
  env,
  serviceName,
  dynamoTable: dynamoDB.profileTable
})
footprintLambda.addDependency(dynamoDB)

const profileLambda = new ProfileStack(app, `${ stage }${ serviceName }ProfileStack`, {
  stage,
  env,
  serviceName,
  footprintTable: dynamoDB.footprintTable,
  profileTable: dynamoDB.profileTable,
  parameterTable: dynamoDB.parameterTable,
  optionTable: dynamoDB.optionTable
})
footprintLambda.addDependency(dynamoDB)

const apiGateway = new ApiGatewayStack(app, `${ stage }${ serviceName }ApiGatewayStack`, {
  stage,
  env,
  serviceName,
  domain: config.domain,
  certificateArn: config.certificateArn,
  helloLambda: lambda.helloLambda,
  footprintLambda: footprintLambda.lambda,
  shareLambda: shareLambda.lambda,
  profileLambda: profileLambda.lambda
})
apiGateway.addDependency(lambda)
apiGateway.addDependency(footprintLambda)
apiGateway.addDependency(shareLambda)
apiGateway.addDependency(profileLambda)

const route53 = new Route53Stack(app, `${ stage }${ serviceName }Route53Stack`, {
  stage,
  env,
  serviceName,
  domain: config.domain,
  api: apiGateway.api
})
route53.addDependency(apiGateway)

Tags.of(app).add('Project', 'JibungotoPlanet');
Tags.of(app).add('Repository', 'JibungotoPlanet-backend');
Tags.of(app).add('Env', stage);
Tags.of(app).add('ManagedBy', 'cdk');
