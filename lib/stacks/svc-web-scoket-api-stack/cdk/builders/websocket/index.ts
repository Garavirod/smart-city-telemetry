import { WebSocketApiBuilder } from "../../../../../libs/cdk-builders/web-socket-api/WebSocketApiBuilder";
import { LambdasFunctionNames } from "../../../../shared/enums/lambdas";
import { SvcWebSocketApiStack } from "../../../stack";

export const runWebSocketApiBuilder = (stack: SvcWebSocketApiStack) => {
  const builder = new WebSocketApiBuilder(stack);

  // Web socket creation
  const webSocketName = "web-socket-api";
  const webSocketApi = builder.createWebsocket({
    webSocketNameId: webSocketName,
    webSocketDescription: `Web socket for the resource ${webSocketName}`,
    lambdaConnection:
      stack.LambdaFunctions[LambdasFunctionNames.NotifyNewConnection],
    lambdaDisconnect:
      stack.LambdaFunctions[LambdasFunctionNames.NotifyDisconnection],
  });

  stack.addWebSocketAPI(webSocketApi);

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
    integration:
      stack.LambdaFunctions[LambdasFunctionNames.NotifySignInConnection],
  });

  builder.createRoute({
    webSocket: webSocketApi,
    routeName: "trainLocation",
    integration:
      stack.LambdaFunctions[LambdasFunctionNames.NotifyTrainLocation],
  });

  // Permissions
  builder.grantLambdaPermissionToInvokeAPI({
    webSocket:webSocketApi,
    lambdaFunctions:[

    ]
  })

  // Export resources
  /* options.builder.createStackExportation({
    exportId: 'WebSocketApiEndpoint',
    exportName: 'WebSocketApiEndpoint'
  }) */
};
