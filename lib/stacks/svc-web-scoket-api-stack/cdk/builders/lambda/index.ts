import { LambdaBuilder } from "../../../../../libs/cdk-builders/LambdaBuilder";
import { LambdasFunctionNames } from "../../../../shared/enums/lambdas";
import {
  DynamoTableIndex,
  DynamoTableNames,
} from "../../../../shared/enums/dynamodb";
import { WebSocketApiStack } from "../../../stack";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export const runLambdaBuilder = (stack: WebSocketApiStack) => {
  const builder = new LambdaBuilder(stack);
  // lambda handler logic code
  const codeFilepathBase = "/svc-web-socket-api-stack/services/handlers";

  // LAMBDAS
  const lambdaFunctions: Record<string, NodejsFunction> = {
    [LambdasFunctionNames.NotifyNewConnection]:
      builder.createNodeFunctionLambda({
        lambdaName: LambdasFunctionNames.NotifyNewConnection,
        pathStackHandlerCode: `${codeFilepathBase}/notify-new-connection.ts`,
        environment: {
          CONNECTIONS_TABLE: stack.getTableId(
            DynamoTableNames.TableNames.Connections
          ),
        },
      }),
    [LambdasFunctionNames.NotifyDisconnection]:
      builder.createNodeFunctionLambda({
        lambdaName: LambdasFunctionNames.NotifyDisconnection,
        pathStackHandlerCode: `${codeFilepathBase}/notify-disconnection.ts`,
        environment: {
          CONNECTIONS_TABLE: stack.getTableId(
            DynamoTableNames.TableNames.Connections
          ),
        },
      }),
    [LambdasFunctionNames.NotifySignInConnection]:
      builder.createNodeFunctionLambda({
        lambdaName: LambdasFunctionNames.NotifySignInConnection,
        pathStackHandlerCode: `${codeFilepathBase}/notify-sign-in-conn.ts`,
        environment: {
          USERS_TABLE: stack.getTableId(DynamoTableNames.TableNames.Users),
          USERS_TABLE_EMAIL_INDEX:
            DynamoTableIndex.UsersTableIndex.EmailICreatedAtIndex,
        },
      }),
    [LambdasFunctionNames.NotifyTrainLocation]:
      builder.createNodeFunctionLambda({
        lambdaName: LambdasFunctionNames.NotifyTrainLocation,
        pathStackHandlerCode: `${codeFilepathBase}/notify-train-location.ts`,
        environment: {
          TRAINS_TABLE: stack.getTableId(DynamoTableNames.TableNames.Trains),
        },
      }),
  };

  // DYNAMO PERMISSIONS
  builder.grantWritePermissionsToDynamo({
    dynamoTable: stack.getTable(DynamoTableNames.TableNames.Connections),
    lambdas: [
      lambdaFunctions[LambdasFunctionNames.NotifyNewConnection],
      lambdaFunctions[LambdasFunctionNames.NotifyDisconnection],
    ],
  });

  return {
    lambdaFunctions,
  };
};
