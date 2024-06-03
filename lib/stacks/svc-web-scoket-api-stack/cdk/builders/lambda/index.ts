import { LambdaBuilder } from "../../../../../libs/cdk-builders/LambdaBuilder";
import { LambdasFunctionNames } from "../../../../shared/enums/lambdas";
import {
  DynamoTableIndex,
  DynamoTableNames,
} from "../../../../shared/enums/dynamodb";
import { SvcWebSocketApiStack } from "../../../stack";

export const runLambdaBuilder = (stack: SvcWebSocketApiStack) => {
  const builder = new LambdaBuilder(stack);
  // lambda handler logic code
  const codeFilepathBase = "/svc-web-socket-api-stack/services/handlers";

  // Lambda functions
  stack.addLambdaFunction({
    lambdaName: LambdasFunctionNames.NotifyNewConnection,
    function: builder.createNodeFunctionLambda({
      lambdaName: LambdasFunctionNames.NotifyNewConnection,
      pathStackHandlerCode: `${codeFilepathBase}/notify-new-connection.ts`,
      environment: {
        CONNECTIONS_TABLE:
          stack.DynamoTables[DynamoTableNames.TableNames.Connections].tableName,
      },
    }),
  });

  stack.addLambdaFunction({
    lambdaName: LambdasFunctionNames.NotifyDisconnection,
    function: builder.createNodeFunctionLambda({
      lambdaName: LambdasFunctionNames.NotifyDisconnection,
      pathStackHandlerCode: `${codeFilepathBase}/notify-disconnection.ts`,
      environment: {
        CONNECTIONS_TABLE:
          stack.DynamoTables[DynamoTableNames.TableNames.Connections].tableName,
      },
    }),
  });

  stack.addLambdaFunction({
    lambdaName: LambdasFunctionNames.NotifySignInConnection,
    function: builder.createNodeFunctionLambda({
      lambdaName: LambdasFunctionNames.NotifySignInConnection,
      pathStackHandlerCode: `${codeFilepathBase}/notify-sign-in-conn.ts`,
      environment: {
        USERS_TABLE:
          stack.DynamoTables[DynamoTableNames.TableNames.Users].tableName,
        USERS_TABLE_EMAIL_INDEX:
          DynamoTableIndex.UsersTableIndex.EmailICreatedAtIndex,
      },
    }),
  });

  stack.addLambdaFunction({
    lambdaName: LambdasFunctionNames.NotifyTrainLocation,
    function: builder.createNodeFunctionLambda({
      lambdaName: LambdasFunctionNames.NotifyTrainLocation,
      pathStackHandlerCode: `${codeFilepathBase}/notify-train-location.ts`,
      environment: {
        TRAINS_TABLE:
          stack.DynamoTables[DynamoTableNames.TableNames.Trains].tableName,
      },
    }),
  });
};
