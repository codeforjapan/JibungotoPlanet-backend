import { aws_dynamodb, aws_lambda_nodejs, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { BaseStackProps } from "./props";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export interface FootprintStackProps extends BaseStackProps {
  dynamoTable: aws_dynamodb.Table
}

export class FootprintStack extends Stack {
  public readonly lambda: NodejsFunction

  constructor(scope: Construct, id: string, props: FootprintStackProps) {
    super(scope, id, props);

    this.lambda = new aws_lambda_nodejs.NodejsFunction(this, "footprintFunction", {
      functionName: `${ props.stage }${ props.serviceName }footprintLambda`,
      entry: path.join(__dirname, './lambda/footprint.ts'),
      handler: "handler",
      runtime: Runtime.NODEJS_16_X,
      environment: {
        TABLE_NAME: props.dynamoTable.tableName,
      },
    })
    props.dynamoTable.grantReadData(this.lambda);
  }
}
