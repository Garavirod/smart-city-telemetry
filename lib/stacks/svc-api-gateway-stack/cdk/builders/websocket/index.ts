import { Stack } from "aws-cdk-lib";
import { WebSocketCDKBuilder } from "../../../../../libs/cdk-builders/web-socket-api";
import { LambdaFunctions } from "../../../../shared/types";
import { WebSocketApi } from "aws-cdk-lib/aws-apigatewayv2";
import { LambdasFunctionNames } from "../../../../shared/enums/lambdas";
import { GlobalEnvironmentVars } from "../../../../../libs/environment";

export const createWebSocketApi = (stack: Stack) => {
  const websocketName = "Web-socket-api";
  const websocket = WebSocketCDKBuilder.createWebsocket({
    scope: stack,
    webSocketNameId: websocketName,
    webSocketDescription: `Web socket for the resource ${websocketName}`,
  });

  WebSocketCDKBuilder.createStage({
    scope: stack,
    stageId: "WebSocketStage",
    stageName: GlobalEnvironmentVars.DEPLOY_ENVIRONMENT,
    webSocket: websocket,
  });

  return websocket;
};

type createRoutesOptions = {
  lambdas: LambdaFunctions;
  webSocket: WebSocketApi;
};
export const createWebSocketRoutes = (options: createRoutesOptions) => {
  /* This is the route that triggers lambda on new connection */
  WebSocketCDKBuilder.createRoute({
    webSocket: options.webSocket,
    routeName: "$connect",
    integration: options.lambdas[LambdasFunctionNames.CreateNewConnection],
  });
  /* This is the route that triggers lambda on disconnections */
  WebSocketCDKBuilder.createRoute({
    webSocket: options.webSocket,
    routeName: "$disconnect",
    integration: options.lambdas[LambdasFunctionNames.DeleteConnection],
  });
  /* This is t he route where the GPS train sensor will publish the message (Locations) */
  WebSocketCDKBuilder.createRoute({
    webSocket: options.webSocket,
    routeName: "trainLocation",
    integration: options.lambdas[LambdasFunctionNames.NotifyTrainLocation],
  });
};
