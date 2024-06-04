import { WebSocketApiBuilder } from "../../../../../libs/cdk-builders/web-socket-api/WebSocketApiBuilder";
import { LambdasFunctionNames } from "../../../../shared/enums/lambdas";
import { WebSocketApiStack } from "../../../stack";

export const runWebSocketApiBuilder = (
  stack: WebSocketApiStack
) => {
  const builder = new WebSocketApiBuilder(stack);

  // Web socket creation
  const webSocketName = "web-socket-api";
  const webSocketApi = builder.createWebsocket({
    webSocketNameId: webSocketName,
    webSocketDescription: `Web socket for the resource ${webSocketName}`,
    lambdaConnection: stack.getLambda(LambdasFunctionNames.NotifyNewConnection),
    lambdaDisconnect: stack.getLambda(LambdasFunctionNames.NotifyDisconnection),
  });

  // Define stage
  builder.createStage({
    stageId: "WebSocketStage",
    stageName: "dev", // TODO set this according environment,
    webSocket: webSocketApi,
  });

  // Define routes
  builder.createRoute({
    webSocket: webSocketApi,
    routeName: "newSignIn",
    integration: stack.getLambda(LambdasFunctionNames.NotifySignInConnection),
  });

  builder.createRoute({
    webSocket: webSocketApi,
    routeName: "trainLocation",
    integration: stack.getLambda(LambdasFunctionNames.NotifyTrainLocation),
  });

  return { webSocketApi };
  // Export resources
  /* options.builder.createStackExportation({
    exportId: 'WebSocketApiEndpoint',
    exportName: 'WebSocketApiEndpoint'
  }) */
};
