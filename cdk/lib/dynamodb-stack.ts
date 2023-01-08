import { aws_dynamodb, RemovalPolicy, Stack } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { BaseStackProps } from "./props";

export class DynamodbStack extends Stack {
  public readonly itemTable: aws_dynamodb.Table
  public readonly footprintTable: aws_dynamodb.Table
  public readonly profileTable: aws_dynamodb.Table
  public readonly parameterTable: aws_dynamodb.Table
  public readonly optionTable: aws_dynamodb.Table

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

    this.footprintTable = new Table(this, `${ props.stage }${ props.serviceName }footprint`, {
      partitionKey: {
        name: "dir_domain",
        type: AttributeType.STRING
      },
      sortKey: {
        name: "item_type",
        type: AttributeType.STRING
      },
      tableName: `${ props.stage }${ props.serviceName }footprint`,
      removalPolicy: RemovalPolicy.DESTROY
    })

    this.profileTable = new Table(this, `${ props.stage }${ props.serviceName }profile`, {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING
      },
      tableName: `${ props.stage }${ props.serviceName }profile`,
      removalPolicy: RemovalPolicy.DESTROY
    })

    this.parameterTable = new Table(this, `${ props.stage }${ props.serviceName }parameter`, {
      partitionKey: {
        name: "category",
        type: AttributeType.STRING
      },
      sortKey: {
        name: "key",
        type: AttributeType.STRING
      },
      tableName: `${ props.stage }${ props.serviceName }parameter`,
      removalPolicy: RemovalPolicy.DESTROY
    })

    this.optionTable = new Table(this, `${ props.stage }${ props.serviceName }option`, {
      partitionKey: {
        name: "option",
        type: AttributeType.STRING
      },
      sortKey: {
        name: "domain_item_type",
        type: AttributeType.STRING
      },
      tableName: `${ props.stage }${ props.serviceName }option`,
      removalPolicy: RemovalPolicy.DESTROY
    })
  }
}
