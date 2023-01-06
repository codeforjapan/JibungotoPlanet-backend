#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Config, getConfig } from '../lib/config';
import { AppStack } from "../lib/app-stack";

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

new AppStack(app, `${ stage }${ serviceName }AppStack`, {
  stage,
  env,
  serviceName
})
