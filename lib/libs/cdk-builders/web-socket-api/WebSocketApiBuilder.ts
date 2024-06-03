import * as apigatewayv2 from "aws-cdk-lib/aws-apigatewayv2";
import { Construct } from "constructs";
import { createResourceNameId } from "../../../stacks/shared/utils/rename-resource-id";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { WebSocketLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { CfnOutput } from "aws-cdk-lib";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

type createWebsocketApiOptions = {
  webSocketNameId: string;
  webSocketDescription: string;
  lambdaConnection: NodejsFunction;
  lambdaDisconnect: NodejsFunction;
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
};

type createExportStackOptions = {
  exportName: string;
  exportId: string;
};

type grantLambdaPermissionsInvokeOptions = {
  webSocket: apigatewayv2.WebSocketApi;
  lambdaFunctions: NodejsFunction[];
};

export class WebSocketApiBuilder {
  private scope: Construct;
  constructor(scope: Construct) {
    this.scope = scope;
  }

  public createWebsocket(options: createWebsocketApiOptions) {
    return new apigatewayv2.WebSocketApi(
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
    options.webSocket.addRoute(options.routeName, {
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
        webSocketApi: options.webSocket,
        stageName: options.stageName,
        autoDeploy: true,
      }
    );
  }

  /* public createStackExportation(options: createExportStackOptions) {
    new CfnOutput(this.scope, createResourceNameId(options.exportId), {
      value: this.webSocket.apiEndpoint,
      exportName: options.exportName,
    });
  } */

  public grantLambdaPermissionToInvokeAPI(
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
}
