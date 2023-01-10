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

    const tableObjects = [
      {
        key: "footprint",
        props: {
          partitionKey: {
            name: "dir_domain",
            type: AttributeType.STRING
          },
          sortKey: {
            name: "item_type",
            type: AttributeType.STRING
          },
        }
      },
      {
        key: "profile",
        props: {
          partitionKey: {
            name: "id",
            type: AttributeType.STRING
          },
        }
      },
      {
        key: 'parameter',
        props: {
          partitionKey: {
            name: "category",
            type: AttributeType.STRING
          },
          sortKey: {
            name: "key",
            type: AttributeType.STRING
          },
        }
      },
      {
        key: 'option',
        props: {
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
    ]

    for (const tableObject of tableObjects) {
      // @ts-ignore
      this[`${tableObject.key}Table`] = new Table(this, `${ props.stage }${ props.serviceName }${ tableObject.key }`, {
        partitionKey: tableObject.props.partitionKey,
        sortKey: tableObject.props.sortKey,
        tableName: `${ props.stage }${ props.serviceName }${ tableObject.key }`,
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
