import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { createResourceNameId } from "../../../stacks/shared/utils/rename-resource-id";
import { RemovalPolicy } from "aws-cdk-lib";

export type addDynamoTableOptions = {
  scope: Construct;
  tableName: string;
  partitionKey: {
    name: string;
    type: "string" | "number" | "binary";
  };
  sortKey?: {
    name: string;
    type: "string" | "number" | "binary";
  };
};

type createGsiOptions = {
  dynamoTable: dynamodb.Table;
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

export function createDynamoTable(options: addDynamoTableOptions) {
  return new dynamodb.Table(
    options.scope,
    createResourceNameId(options.tableName),
    {
      partitionKey: {
        name: options.partitionKey.name,
        type: getType(options.partitionKey.type),
      },
      removalPolicy: RemovalPolicy.RETAIN,
      //billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Pay-per-request mode to avoid provisioned throughput charges
    }
  );
}

function getType(type: string) {
  const types: Record<string, dynamodb.AttributeType> = {
    string: dynamodb.AttributeType.STRING,
    number: dynamodb.AttributeType.NUMBER,
    binary: dynamodb.AttributeType.BINARY,
  };
  return types[type];
}

export function createGSI(options: createGsiOptions) {
  const partitionKey = {
    name: options.partitionKey.prop,
    type: getType(options.partitionKey.type),
  };
  let sortKey;
  if (options.sortKey) {
    sortKey = {
      name: options.sortKey.prop,
      type: getType(options.sortKey.type),
    };
  }

  options.dynamoTable.addGlobalSecondaryIndex({
    indexName: options.indexName,
    partitionKey,
    sortKey,
    projectionType: dynamodb.ProjectionType.ALL,
  });
}
