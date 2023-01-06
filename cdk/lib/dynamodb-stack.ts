import { aws_dynamodb, RemovalPolicy, Stack } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { BaseStackProps } from "./props";

export class DynamodbStack extends Stack {
  public readonly table: aws_dynamodb.Table

  constructor(scope: Construct, id: string, props: BaseStackProps) {
    super(scope, id, props);

    this.table = new Table(this, "items", {
      partitionKey: {
        name: "itemId",
        type: AttributeType.STRING,
      },
      tableName: "items",
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
    });

  }
}