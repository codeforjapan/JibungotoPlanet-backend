#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Config, getConfig } from '../lib/config';
import { AppStack } from "../lib/app-stack";
import { DynamodbStack } from "../lib/dynamodb-stack";
import { ApiGatewayStack } from "../lib/api-gateway-stack";
import { FootprintStack } from "../lib/footprint-stack";
import { ShareStack } from "../lib/share-stack";

const app = new cdk.App();

const stages = ['dev', 'staging']
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

const apiGateway = new ApiGatewayStack(app, `${ stage }${ serviceName }ApiGatewayStack`, {
  stage,
  env,
  serviceName,
  itemLambda: lambda.itemLambda,
  helloLambda: lambda.helloLambda,
  footprintLambda: footprintLambda.lambda,
  shareLambda: shareLambda.lambda
})
apiGateway.addDependency(lambda)
apiGateway.addDependency(footprintLambda)
apiGateway.addDependency(shareLambda)
