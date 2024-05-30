import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import { Construct } from "constructs";
import { createResourceNameId } from "../../../stacks/shared/utils/rename-resource-id";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { WebSocketLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { CfnOutput } from "aws-cdk-lib";

type createWebsocketApiOptions = {
  webSocketNameId: string;
  webSocketDescription: string;
  lambdaConnection: NodejsFunction;
  lambdaDisconnect: NodejsFunction;
};

type createRouteOption = {
  routeName: string;
  integration: NodejsFunction;
};

type createStageOptions = {
  stageId: string;
  stageName: string;
};

type createExportStackOptions = {
  exportName: string;
  exportId: string;
};

export class WebSocketApiBuilder {
  private scope: Construct;
  private webSocket: apigatewayv2.WebSocketApi;
  constructor(scope: Construct) {
    this.scope = scope;
  }

  public createWebsocket(options: createWebsocketApiOptions) {
    this.webSocket = new apigatewayv2.WebSocketApi(
      this.scope,
      createResourceNameId(options.webSocketNameId),
      {
        description: options.webSocketDescription,
        connectRouteOptions: {
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
        },
      }
    );
  }

  public createRoute(options: createRouteOption) {
    this.webSocket.addRoute(options.routeName, {
      integration: new WebSocketLambdaIntegration(
        createResourceNameId(`${options.routeName}-route-int`),
        options.integration
      ),
    });
  }

  public createStage(options: createStageOptions) {
    new apigatewayv2.WebSocketStage(
      this.scope,
      createResourceNameId(options.stageId),
      {
        webSocketApi: this.webSocket,
        stageName: options.stageName,
        autoDeploy: true,
      }
    );
  }

  public createStackExportation(options: createExportStackOptions) {
    new CfnOutput(this.scope, createResourceNameId(options.exportId), {
      value: this.webSocket.apiEndpoint,
      exportName: options.exportName,
    });
  }
}
