import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { createResourceNameId } from "../../../stacks/shared/utils/rename-resource-id";
import { GlobalEnvironmentVars } from "../../environment";
import path = require("path");
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Duration, aws_lambda_event_sources } from "aws-cdk-lib";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { UserPool, UserPoolOperation } from "aws-cdk-lib/aws-cognito";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Logger } from "../../logger";
import { WebSocketApi } from "aws-cdk-lib/aws-apigatewayv2";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Topic } from "aws-cdk-lib/aws-sns";

type addLambdaFunctionOptions = {
  scope: Construct;
  lambdaName: string;
  pathStackHandlerCode: string;
  environment: Record<string, string>;
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
        `../../../stacks${options.pathStackHandlerCode}`
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

type lambdaPermissionsOption = {
  dynamoTable: Table;
  lambdas: NodejsFunction[];
};
/**
 * Give Dynamo writing permission to lambda resources
 * @param options
 */
export function grantWritePermissionsToDynamo(
  options: lambdaPermissionsOption
) {
  for (let i = 0; i < options.lambdas.length; i++) {
    options.dynamoTable.grantWriteData(options.lambdas[i]);
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

type lambdaPermissionCognitoUsersOptions = {
  lambdaFunctions: NodejsFunction[];
  userPool: UserPool;
};

/**
 * Grant the Lambda function permissions to sign up users in Cognito
 * @param options @link{lambdaPermissionCognitoUsersOptions}
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

type preSignupLambdaTriggerOptions = {
  lambdaFunction: NodejsFunction;
  userPool: UserPool;
};
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

type grantLambdaPermissionsInvokeOptions = {
  webSocket: WebSocketApi;
  lambdaFunctions: NodejsFunction[];
};
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

type addSqsEventSourcesOptions = {
  lambda: NodejsFunction;
  queue: Queue;
};
export function addSqsEventSource(options: addSqsEventSourcesOptions) {
  const sqsEventSource = new aws_lambda_event_sources.SqsEventSource(
    options.queue,
    {
      batchSize: 5, // Process up to 5 messages at a time to stay within Free Tier
    }
  );
  options.lambda.addEventSource(sqsEventSource);
}

type addSnsEventSourcesOptions = {
  lambda: NodejsFunction;
  topic: Topic;
};
export function addSnsEventSource(options: addSnsEventSourcesOptions) {
  const sqsEventSource = new aws_lambda_event_sources.SnsEventSource(
    options.topic
  );
  options.lambda.addEventSource(sqsEventSource);
}

type lambdaPublishPermissionsOptions = {
  lambdas: NodejsFunction[];
  topic: Topic;
};
export function grantTopicPublishPermissions(
  options: lambdaPublishPermissionsOptions
) {
  for (let i = 0; i < options.lambdas.length; i++) {
    options.topic.grantPublish(options.lambdas[i]);
  }
}
