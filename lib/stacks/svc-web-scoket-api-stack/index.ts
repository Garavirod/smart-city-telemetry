import { App } from "aws-cdk-lib";
import { GenericStack } from "../../libs/cdk-builders/GenericStack";
import { DynamoBuilder } from "../../libs/cdk-builders/DynamoBuilder";
import { LambdaBuilder } from "../../libs/cdk-builders/LambdaBuilder";
import { WebSocketApiBuilder } from "../../libs/cdk-builders/web-socket-api/WebSocketApiBuilder";
import { DynamoTableNames } from "../shared/enums/dynamodb";
import { LambdasFunctionNames } from "../shared/enums/lambdas";

export const buildSvcWebSocketApiStack = (app: App) => {
  const stackName = "SvcWebSocketApi";
  const stack = new GenericStack(app, stackName);

  const dynamoBuilder = new DynamoBuilder(stack);
  const lambdaBuilder = new LambdaBuilder(stack);
  const webSocketBuilder = new WebSocketApiBuilder(stack);

  // Dynamo permissions
  dynamoBuilder.grantWritePermissionsToLambdas({
    dynamoTable: DynamoTableNames.TableNames.Connections,
    lambdas: [
      lambdaBuilder.getLambdaFunctions[
        LambdasFunctionNames.NotifyNewConnection
      ],
      lambdaBuilder.getLambdaFunctions[
        LambdasFunctionNames.NotifyDisconnection
      ],
    ],
  });
};
