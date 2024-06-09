import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import { Construct } from "constructs";
import { createResourceNameId } from "../../../stacks/shared/utils/rename-resource-id";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { WebSocketLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";

type createWebsocketApiOptions = {
  webSocketNameId: string;
  webSocketDescription: string;
  scope: Construct;
};

type createRouteOption = {
  routeName: string;
  integration: NodejsFunction;
  webSocket: apigatewayv2.WebSocketApi;
};

type createStageOptions = {
  stageId: string;
  stageName: string;
  webSocket: apigatewayv2.WebSocketApi;
  scope: Construct;
};

type createExportStackOptions = {
  exportName: string;
  exportId: string;
};

export function createWebsocket(options: createWebsocketApiOptions) {
  return new apigatewayv2.WebSocketApi(
    options.scope,
    createResourceNameId(options.webSocketNameId),
    {
      description: options.webSocketDescription,
      /* connectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          createResourceNameId("lambda-connections"),
          options.lambdaConnection
        ),
      },
      disconnectRouteOptions: {
        integration: new WebSocketLambdaIntegration(
          createResourceNameId("lambda-disconnections"),
          options.lambdaDisconnect
        ),
      }, */
    }
  );
}

export function createRoute(options: createRouteOption) {
  options.webSocket.addRoute(options.routeName, {
    integration: new WebSocketLambdaIntegration(
      createResourceNameId(`${options.routeName}-route-int`),
      options.integration
    ),
  });
}

export function createStage(options: createStageOptions) {
  new apigatewayv2.WebSocketStage(
    options.scope,
    createResourceNameId(options.stageId),
    {
      webSocketApi: options.webSocket,
      stageName: options.stageName,
      autoDeploy: true,
    }
  );
}
