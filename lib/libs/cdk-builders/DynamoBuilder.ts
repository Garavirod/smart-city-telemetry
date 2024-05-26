import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { createResourceNameId } from "../../stacks/shared/utils/rename-resource-id";
import { RemovalPolicy } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export type createDynamoOptions = {
  tableName: string;
  partitionKey: {
    name: string;
    type: dynamodb.AttributeType;
  };
};

export type lambdaPermissionsOption = {
  dynamoTable: string;
  lambdas: NodejsFunction[];
};

type createGsiOptions = {
  dynamoTable: string;
  indexName: string;
  partitionKey: {
    prop: string;
    type: "string" | "number" | "binary";
  };
  sortKey?: {
    prop: string;
    type: "string" | "number" | "binary";
  };
};

export class DynamoBuilder {
  private scope: Construct;
  private dynamoTables: Record<string, dynamodb.Table>;
  private dynamoTablesIndices: Record<string, string>;
  constructor(scope: Construct) {
    this.scope = scope;
    this.dynamoTables = { ...this.dynamoTables };
    this.dynamoTablesIndices = { ...this.dynamoTablesIndices };
  }

  public createTable(options: createDynamoOptions) {
    this.dynamoTables[options.tableName] = new dynamodb.Table(
      this.scope,
      createResourceNameId(options.tableName),
      {
        partitionKey: {
          name: options.partitionKey.name,
          type: options.partitionKey.type,
        },
        removalPolicy: RemovalPolicy.RETAIN,
        //billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Pay-per-request mode to avoid provisioned throughput charges
      }
    );
  }

  public createGSI(options: createGsiOptions) {
    const types: Record<string, dynamodb.AttributeType> = {
      string: dynamodb.AttributeType.STRING,
      number: dynamodb.AttributeType.NUMBER,
      binary: dynamodb.AttributeType.BINARY,
    };

    const partitionKey = {
      name: options.partitionKey.prop,
      type: types[options.partitionKey.type],
    };
    let sortKey;
    if (options.sortKey) {
      sortKey = {
        name: options.sortKey.prop,
        type: types[options.sortKey.type],
      };
    }

    this.dynamoTables[options.dynamoTable].addGlobalSecondaryIndex({
      indexName: options.indexName,
      partitionKey,
      sortKey,
      projectionType: dynamodb.ProjectionType.ALL,
    });
  }

  public grantWritePermissionsToLambdas(options: lambdaPermissionsOption) {
    for (let i = 0; i < options.lambdas.length; i++) {
      this.dynamoTables[options.dynamoTable].grantReadWriteData(
        options.lambdas[i]
      );
    }
  }

  /**
   * Give Dynamo read permission to lambda resource
   * @param options
   */
  public grantReadPermissionsToLambdas(options: lambdaPermissionsOption) {
    for (let i = 0; i < options.lambdas.length; i++) {
      this.dynamoTables[options.dynamoTable].grantReadData(options.lambdas[i]);
    }
  }

  public get getDynamoTables() {
    return this.dynamoTables;
  }
}
