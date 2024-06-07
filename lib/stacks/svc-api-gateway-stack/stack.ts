import { App, Stack } from "aws-cdk-lib";
import { WebSocketCDKBuilder } from "../../libs/cdk-builders/web-socket-api";
import { LambdasFunctionNames } from "../shared/enums/lambdas";
import { createTables } from "./cdk/builders/dynamo";
import { createCognitoPools } from "./cdk/builders/cognito";
import { createUsersLambdas } from "./cdk/builders/lambda/users";
import { createDependenciesLambdas } from "./cdk/builders/lambda/dependencies";
import { createWebSocketConnLambdas } from "./cdk/builders/lambda/web-socket-connections";
import { createTrainsLambdas } from "./cdk/builders/lambda/trains";
import { createRestApi } from "./cdk/builders/api";

export function createSvcApisStack(app:App) {
    const stack = new Stack(app, "SvcApis");
    // Websocket settings
    const websocket = WebSocketCDKBuilder.createWebsocket({
      scope: stack,
      webSocketNameId: "Web-socket=api",
      webSocketDescription: `Web socket for the resource web-socket=api`,
    });

    WebSocketCDKBuilder.createStage({
      scope: stack,
      stageId: "WebSocketStage",
      stageName: "dev", // TODO set this according environment,
      webSocket: websocket,
    });

    // Dynamo Settings
    const dynamoTables = createTables(stack);

    // Cognito settings
    const { userPoolClients, userPools } =
      createCognitoPools(stack);
    const cognitoUserPools = userPools;
    const cognitoUserPoolClients = userPoolClients;

    // Lambda settings
    const lambdaFunctions = {
      ...createUsersLambdas({
        webSocket: websocket,
        tables: dynamoTables,
        cognitoClients: cognitoUserPoolClients,
        cognitoPools: cognitoUserPools,
        stack,
      }),
      ...createDependenciesLambdas(stack, dynamoTables),
      ...createWebSocketConnLambdas(stack, dynamoTables),
      ...createTrainsLambdas(stack, dynamoTables),
    };

    // Rest api
    const restApi = createRestApi({
      lambdas: lambdaFunctions,
      cognitoPools: cognitoUserPools,
      stack,
    });

    // Create Websocket route
    /* This is t he route where the GPS train sensor will publish the message (Locations) */
    WebSocketCDKBuilder.createRoute({
      webSocket: websocket,
      routeName: "$connect",
      integration:
        lambdaFunctions[LambdasFunctionNames.CreateNewConnection],
    });
    WebSocketCDKBuilder.createRoute({
      webSocket: websocket,
      routeName: "$disconnect",
      integration: lambdaFunctions[LambdasFunctionNames.DeleteConnection],
    });

    WebSocketCDKBuilder.createRoute({
      webSocket: websocket,
      routeName: "trainLocation",
      integration:
      lambdaFunctions[LambdasFunctionNames.NotifyTrainLocation],
    });
  }

