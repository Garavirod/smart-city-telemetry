import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdasKeyNames } from "../lambda/types";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";
import { DynamoTablesKeyNames, ManagementDynamoKeyName } from "./types";
import { overrideLogicalResourceName } from "../helpers/override-logical-resource-name";

export class ManagementDynamoDB {
  private lambdaFunctions: Record<LambdasKeyNames, NodejsFunction>;
  private dynamoTables: Record<DynamoTablesKeyNames, dynamodb.Table>;
  private scope: Construct;


  constructor(scope: Construct) {
    this.scope = scope;
    this.lambdaFunctions = { ...this.lambdaFunctions };
    this.dynamoTables = { ...this.dynamoTables };
    this.createDynamoTables();
    this.overrideLogicalNameResources();
  }

  private createDynamoTables() {
    // Users Table
    this.dynamoTables[ManagementDynamoKeyName.Users] = new dynamodb.Table(
      this.scope,
      ManagementDynamoKeyName.Users,
      {
        partitionKey: {
          name: "user_id",
          type: dynamodb.AttributeType.STRING,
        },
        removalPolicy: RemovalPolicy.DESTROY,
      }
    );
  }

  /**
   * Set the lambdas for using them inside class
   * @param lambdaFunctions
   */
  public setLambdaHandlers(
    lambdaFunctions: Record<LambdasKeyNames, NodejsFunction>
  ) {
    this.lambdaFunctions = { ...this.lambdaFunctions, ...lambdaFunctions };
  }

  /**
   * Grants write Permissions for specific lambda
   * resources given the key name lambda
   * @param props
   */
  public grantWritePermissionsToLambdas(props: {
    keyNameTable: DynamoTablesKeyNames;
    keyNameLambdas: LambdasKeyNames[];
  }) {
    for (const keyNameLambda of props.keyNameLambdas) {
      this.dynamoTables[props.keyNameTable].grantReadWriteData(
        this.lambdaFunctions[keyNameLambda]
      );
    }
  }


  private overrideLogicalNameResources() {
    for (const k in this.dynamoTables) {
      overrideLogicalResourceName({
        resource: this.dynamoTables[k as DynamoTablesKeyNames ],
      });
    }
  }
}
