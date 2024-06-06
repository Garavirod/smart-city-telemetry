import { Stack, StackProps } from "aws-cdk-lib";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { Construct } from "constructs";
import { WebSocketApi } from "aws-cdk-lib/aws-apigatewayv2";
import { WebSocketCDKBuilder } from "../../libs/cdk-builders/web-socket-api";
import { LambdasFunctionNames } from "../shared/enums/lambdas";
import { createTables } from "./cdk/builders/dynamo";
import { createCognitoPools } from "./cdk/builders/cognito";
import {
  CognitoUserPoolClients,
  CognitoUserPools,
  DynamoDBTables,
  LambdaFunctions,
} from "../shared/types";
import { createUsersLambdas } from "./cdk/builders/lambda/users";
import { createDependenciesLambdas } from "./cdk/builders/lambda/dependencies";
import { createWebSocketConnLambdas } from "./cdk/builders/lambda/web-socket-connections";
import { createTrainsLambdas } from "./cdk/builders/lambda/trains";

export class ApiGatewayStack extends Stack {
  private lambdaFunctions: LambdaFunctions;
  private dynamoTables: DynamoDBTables;
  private cognitoUserPools: CognitoUserPools;
  private cognitoUserPoolClients: CognitoUserPoolClients;
  private restApi: RestApi;
  private websocket: WebSocketApi;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.createStackConstructs();
  }

  private createStackConstructs() {
    // Websocket settings
    this.websocket = WebSocketCDKBuilder.createWebsocket({
      scope: this,
      webSocketNameId: "Web-socket=api",
      webSocketDescription: `Web socket for the resource web-socket=api`,
    });

    WebSocketCDKBuilder.createStage({
      scope: this,
      stageId: "WebSocketStage",
      stageName: "dev", // TODO set this according environment,
      webSocket: this.websocket,
    });

    // Dynamo Settings
    this.dynamoTables = createTables(this);

    // Cognito settings
    const { cognitoUserPoolClients, cognitoUserPools } =
      createCognitoPools(this);
    this.cognitoUserPools = cognitoUserPools;
    this.cognitoUserPoolClients = cognitoUserPoolClients;

    // Lambda settings
    this.lambdaFunctions = {
      ...createUsersLambdas({
        webSocket: this.websocket,
        tables: this.dynamoTables,
        cognitoClients: this.cognitoUserPoolClients,
        cognitoPools: this.cognitoUserPools,
        stack: this,
      }),
      ...createDependenciesLambdas(this, this.dynamoTables),
      ...createWebSocketConnLambdas(this, this.dynamoTables),
      ...createTrainsLambdas(this, this.dynamoTables),
    };

    // Create Websocket route
    /* This is t he route where the GPS train sensor will publish the message (Locations) */
    WebSocketCDKBuilder.createRoute({
      webSocket: this.websocket,
      routeName: "$connect",
      integration:
        this.lambdaFunctions[LambdasFunctionNames.CreateNewConnection],
    });
    WebSocketCDKBuilder.createRoute({
      webSocket: this.websocket,
      routeName: "$disconnect",
      integration: this.lambdaFunctions[LambdasFunctionNames.DeleteConnection],
    });

    WebSocketCDKBuilder.createRoute({
      webSocket: this.websocket,
      routeName: "trainLocation",
      integration:
        this.lambdaFunctions[LambdasFunctionNames.NotifyTrainLocation],
    });
  }
}
