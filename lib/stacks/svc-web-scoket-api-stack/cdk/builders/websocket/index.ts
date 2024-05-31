import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { WebSocketApiBuilder } from "../../../../../libs/cdk-builders/web-socket-api/WebSocketApiBuilder";
import { LambdasFunctionNames } from "../../../../shared/enums/lambdas";

type buildWebSocketOptions = {
  builder: WebSocketApiBuilder;
  lambdaFunctions: Record<string, NodejsFunction>;
};

export const runWebSocketApiBuilder = (options: buildWebSocketOptions) => {
  // Web socket creation
  const webSocketName = "web-socket-api";
  options.builder.createWebsocket({
    webSocketNameId: webSocketName,
    webSocketDescription: `Web socket for the resource ${webSocketName}`,
    lambdaConnection:
      options.lambdaFunctions[LambdasFunctionNames.NotifyNewConnection],
    lambdaDisconnect:
      options.lambdaFunctions[LambdasFunctionNames.NotifyDisconnection],
  });

  // Define stage
  options.builder.createStage({
    stageId: "WebSocketStage",
    stageName: "dev", // TODO set this according environment
  });

  // Define routes
  options.builder.createRoute({
    routeName: "newSignIn",
    integration:
      options.lambdaFunctions[LambdasFunctionNames.NotifySignInConnection],
  });

  options.builder.createRoute({
    routeName: "trainLocation",
    integration:
      options.lambdaFunctions[LambdasFunctionNames.NotifyTrainLocation],
  });
};
