import { App, Stack } from "aws-cdk-lib";
import { GenericStack } from "../../libs/cdk-builders/GenericStack";
import { DynamoBuilder } from "../../libs/cdk-builders/DynamoBuilder";
import { LambdaBuilder } from "../../libs/cdk-builders/LambdaBuilder";
import { WebSocketApiBuilder } from "../../libs/cdk-builders/web-socket-api/WebSocketApiBuilder";
import { DynamoTableNames } from "../shared/enums/dynamodb";
import { LambdasFunctionNames } from "../shared/enums/lambdas";
import { SvcWebSocketApiBuilders } from "./cdk";
import { SvcWebSocketApiStack } from "./stack";

export const createStackSvcWebSocketApi = (app: App) => {
  const stackName = "SvcWebSocketApi";
  const stack = new SvcWebSocketApiStack(app, stackName);
  // Run builders
  SvcWebSocketApiBuilders.runDynamoBuilder(stack);
  SvcWebSocketApiBuilders.runLambdaBuilder(stack);
  SvcWebSocketApiBuilders.runWebSocketApiBuilder(stack);
};
