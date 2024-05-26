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

export class DynamoBuilder {
  private scope: Construct;
  private dynamoTables: Record<string, dynamodb.Table>;
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
        removalPolicy: RemovalPolicy.RETAIN,
        //billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Pay-per-request mode to avoid provisioned throughput charges
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
