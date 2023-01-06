import { aws_dynamodb, RemovalPolicy, Stack } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { BaseStackProps } from "./props";

export class DynamodbStack extends Stack {
  public readonly itemTable: aws_dynamodb.Table
  public readonly profileTable: aws_dynamodb.Table

  constructor(scope: Construct, id: string, props: BaseStackProps) {
    super(scope, id, props);

    this.itemTable = new Table(this, `${ props.stage }${ props.serviceName }items`, {
      partitionKey: {
        name: "itemId",
        type: AttributeType.STRING
      },
      tableName: `${ props.stage }${ props.serviceName }items`,
      removalPolicy: RemovalPolicy.DESTROY
    })

    this.profileTable = new Table(this, `${ props.stage }${ props.serviceName }profiles`, {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      },
      tableName: `${ props.stage }${ props.serviceName }profile`,
      removalPolicy: RemovalPolicy.DESTROY
    })
  }
}
