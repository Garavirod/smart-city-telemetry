import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { createResourceNameId } from "../helpers";
import { RemovalPolicy } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { DynamoTableNames } from "./types";

export type createDynamoOptions = {
  tableName: DynamoTableNames;
  partitionKey: {
    name: string;
    type: dynamodb.AttributeType;
  };
};

export type lambdaPermissionsOption = {
  dynamoTable: DynamoTableNames;
  lambdas: NodejsFunction[];
};

export class DynamoBuilder {
  private scope: Construct;
  private dynamoTables: Record<DynamoTableNames, dynamodb.Table>;
  constructor(scope: Construct) {
    this.scope = scope;
    this.dynamoTables = { ...this.dynamoTables };
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
        removalPolicy: RemovalPolicy.DESTROY,
      }
    );
  }

  public grantWritePermissionsToLambdas(options: lambdaPermissionsOption) {
    for (let i = 0; i < options.lambdas.length; i++) {
      this.dynamoTables[options.dynamoTable].grantReadWriteData(
        options.lambdas[i]
      );
    }
  }

  public get getDynamoTables() {
    return this.dynamoTables;
  }
}
