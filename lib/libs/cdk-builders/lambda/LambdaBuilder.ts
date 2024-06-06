import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { createResourceNameId } from "../../../stacks/shared/utils/rename-resource-id";
import { GlobalEnvironmentVars } from "../../environment";
import path = require("path");
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Duration } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { UserPool, UserPoolOperation } from "aws-cdk-lib/aws-cognito";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Logger } from "../../logger";
import { WebSocketApi } from "aws-cdk-lib/aws-apigatewayv2";

type addLambdaFunctionOptions = {
  scope: Construct;
  lambdaName: string;
  pathStackHandlerCode: string;
  environment: Record<string, string>;
};

type lambdaPermissionsOption = {
  dynamoTable: Table;
  lambdas: NodejsFunction[];
};

type lambdaPermissionCognitoUsersOptions = {
  lambdaFunctions: NodejsFunction[];
  userPool: UserPool;
};

type preSignupLambdaTriggerOptions = {
  lambdaFunction: NodejsFunction;
  userPool: UserPool;
};

type grantLambdaPermissionsInvokeOptions = {
  webSocket: WebSocketApi;
  lambdaFunctions: NodejsFunction[];
};

/**
 * Creates an instance of NodejsFunction for creating a lambda
 * handler
 * @param props
 * @returns {NodejsFunction}
 */
export function createNodeFunctionLambda(options: addLambdaFunctionOptions) {
  return new NodejsFunction(
    options.scope,
    createResourceNameId(options.lambdaName),
    {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: path.join(
        __dirname,
        `../../stacks/${options.pathStackHandlerCode}`
      ),
      environment: {
        DEPLOY_ENVIRONMENT: GlobalEnvironmentVars.DEPLOY_ENVIRONMENT,
        LOGGER_LEVEL: GlobalEnvironmentVars.LOGGER_LEVEL,
        ...options.environment,
      },
      memorySize: 128, // Keep memory size low
      timeout: Duration.seconds(10), // Keep timeout short
    }
  );
}

/**
 * Give Dynamo writing permission to lambda resources
 * @param options
 */
export function grantWritePermissionsToDynamo(
  options: lambdaPermissionsOption
) {
  for (let i = 0; i < options.lambdas.length; i++) {
    options.dynamoTable.grantReadWriteData(options.lambdas[i]);
  }
}

/**
 * Give Dynamo read permission to lambda resources
 * @param options
 */
export function grantReadPermissionsToDynamo(options: lambdaPermissionsOption) {
  for (let i = 0; i < options.lambdas.length; i++) {
    options.dynamoTable.grantReadData(options.lambdas[i]);
  }
}

/**
 * Grant the Lambda function permissions to sign up users in Cognito
 * @param options {lambdaPermissionCognitoUsersOptions}
 */
export function grantLambdasCreateUsersPermission(
  options: lambdaPermissionCognitoUsersOptions
) {
  for (let i = 0; i < options.lambdaFunctions.length; i++) {
    options.lambdaFunctions[i].addToRolePolicy(
      new PolicyStatement({
        actions: ["cognito-idp:SignUp"],
        resources: [options.userPool.userPoolArn],
      })
    );
  }
}

/**
 * Grant the Lambda function permissions to sign In users in Cognito
 * @param options {lambdaPermissionCognitoUsersOptions}
 */
export function grantLambdasSignInUsersPermission(
  options: lambdaPermissionCognitoUsersOptions
) {
  for (let i = 0; i < options.lambdaFunctions.length; i++) {
    options.lambdaFunctions[i].addToRolePolicy(
      new PolicyStatement({
        actions: ["cognito-idp:InitiateAuth"],
        resources: [options.userPool.userPoolArn],
      })
    );
  }
}

/**
 * This method only must be used on Dev or Qa environments
 * @param options
 */
export function addPreSignupLambdaTrigger(
  options: preSignupLambdaTriggerOptions
) {
  if (GlobalEnvironmentVars.DEPLOY_ENVIRONMENT !== "Prod") {
    options.userPool.addTrigger(
      UserPoolOperation.PRE_SIGN_UP,
      options.lambdaFunction
    );
  } else {
    Logger.warn(
      `Deploy environment value ${GlobalEnvironmentVars.DEPLOY_ENVIRONMENT}`
    );
  }
}

export function grantPermissionToInvokeAPI(
  options: grantLambdaPermissionsInvokeOptions
) {
  for (let i = 0; i < options.lambdaFunctions.length; i++) {
    options.lambdaFunctions[i].addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["execute-api:ManageConnections"],
        resources: [`${options.webSocket.arnForExecuteApi()}/@connections/*`],
      })
    );
  }
}
