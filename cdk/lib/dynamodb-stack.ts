import { aws_dynamodb, RemovalPolicy, Stack } from "aws-cdk-lib";
import { Attribute, AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { BaseStackProps } from "./props";

export class DynamodbStack extends Stack {
  public readonly itemTable: aws_dynamodb.Table
  public readonly footprintTable: aws_dynamodb.Table
  public readonly profileTable: aws_dynamodb.Table
  public readonly parameterTable: aws_dynamodb.Table
  public readonly optionTable: aws_dynamodb.Table

  constructor(scope: Construct, id: string, props: BaseStackProps) {
    super(scope, id, props)

    interface TableObjects {
      [key: string]: {
        partitionKey: Attribute
        sortKey?: Attribute
      }
    }

    const tableObjects: TableObjects = {
      footprint: {
        partitionKey: {
          name: "dir_domain",
          type: AttributeType.STRING
        },
        sortKey: {
          name: "item_type",
          type: AttributeType.STRING
        },
      },
      profile: {
        partitionKey: {
          name: "id",
          type: AttributeType.STRING
        },
      },
      parameter: {
        partitionKey: {
          name: "category",
          type: AttributeType.STRING
        },
        sortKey: {
          name: "key",
          type: AttributeType.STRING
        },
      },
      option: {
        partitionKey: {
          name: "option",
          type: AttributeType.STRING
        },
        sortKey: {
          name: "domain_item_type",
          type: AttributeType.STRING
        },
      }
    }

    for (const [key, tableObject] of Object.entries(tableObjects)) {
      // @ts-ignore
      this[`${ key }Table`] = new Table(this, `${ props.stage }${ props.serviceName }${ key }`, {
        partitionKey: tableObject.partitionKey,
        sortKey: tableObject.sortKey,
        tableName: `${ props.stage }${ props.serviceName }${ key }`,
        removalPolicy: RemovalPolicy.DESTROY
      })
    }

    this.profileTable.addGlobalSecondaryIndex({
      indexName: "profilesByShareId",
      partitionKey: {
        name: "shareId",
        type: AttributeType.STRING
      }
    })
  }
}
