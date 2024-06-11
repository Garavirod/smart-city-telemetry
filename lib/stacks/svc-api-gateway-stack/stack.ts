import { App, Stack } from "aws-cdk-lib";
import { createTables } from "./cdk/builders/dynamo";
import { createCognitoPools } from "./cdk/builders/cognito";
import { createUsersLambdas } from "./cdk/builders/lambda/users";
import { createDependenciesLambdas } from "./cdk/builders/lambda/dependencies";
import { createWebSocketConnLambdas } from "./cdk/builders/lambda/web-socket-connections";
import { createTrainsLambdas } from "./cdk/builders/lambda/trains";
import { createRestApi } from "./cdk/builders/api";
import {
  createWebSocketApi,
  createWebSocketRoutes,
} from "./cdk/builders/websocket";
import { createUsersTopics } from "./cdk/builders/sns/users";
import { DynamoDBTables, LambdaFunctions, SnsTopics } from "../shared/types";
import { createTrainTopics } from "./cdk/builders/sns/trains";

export function createTelemetryStack(app: App) {
  const stack = new Stack(app, "TelemetryStack");
  // Websocket settings
  const websocket = createWebSocketApi(stack);
  // Dynamo Settings
  const dynamoTables: DynamoDBTables = createTables(stack);

  // Cognito settings
  const { userPoolClients, userPools } = createCognitoPools(stack);
  const cognitoUserPools = userPools;
  const cognitoUserPoolClients = userPoolClients;

  // Sns topic settings
  const snsTopics: SnsTopics = {
    ...createUsersTopics(stack),
    ...createTrainTopics(stack),
  };

  // Lambda settings
  const lambdaFunctions: LambdaFunctions = {
    ...createUsersLambdas({
      stack,
      webSocket: websocket,
      tables: dynamoTables,
      cognitoClients: cognitoUserPoolClients,
      cognitoPools: cognitoUserPools,
      topics: snsTopics,
    }),
    ...createDependenciesLambdas(stack, dynamoTables),
    ...createWebSocketConnLambdas(stack, dynamoTables),
    ...createTrainsLambdas({
      stack,
      tables: dynamoTables,
      topics: snsTopics,
      webSocket: websocket,
    }),
  };

  // Rest api
  const restApi = createRestApi({
    lambdas: lambdaFunctions,
    cognitoPools: cognitoUserPools,
    stack,
  });

  // Add Websocket route
  createWebSocketRoutes({
    lambdas: lambdaFunctions,
    webSocket: websocket,
  });
}
