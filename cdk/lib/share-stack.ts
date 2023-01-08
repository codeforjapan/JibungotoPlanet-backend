import { aws_dynamodb, aws_iam, aws_lambda_nodejs, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { BaseStackProps } from "./props";
import { Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export interface ShareStackProps extends BaseStackProps {
  dynamoTable: aws_dynamodb.Table
}

export class ShareStack extends Stack {
  public readonly lambda: NodejsFunction

  constructor(scope: Construct, id: string, props: ShareStackProps) {
    super(scope, id, props);

    this.lambda = new aws_lambda_nodejs.NodejsFunction(this, "ShareFunction", {
      functionName: `${ props.stage }${ props.serviceName }shareLambda`,
      entry: path.join(__dirname, './lambda/share.ts'),
      handler: "handler",
      runtime: Runtime.NODEJS_16_X,
      environment: {
        TABLE_NAME: props.dynamoTable.tableName,
      },
      tracing: Tracing.ACTIVE,
    })
    props.dynamoTable.grantReadData(this.lambda);
    this.lambda.addToRolePolicy(
      new aws_iam.PolicyStatement({
        actions: ['dynamodb:Query'],
        resources: [`${props.dynamoTable.tableArn}/index/*`],
      }),
    );
  }
}