import { DynamoBuilder } from "../../../../../libs/cdk-builders/DynamoBuilder";
import { DynamoTableNames } from "../../../../shared/enums/dynamodb";
import { LambdasFunctionNames } from "../../../../shared/enums/lambdas";


export const runDynamoBuilder = (stack: SvcWebSocketApiStack) => {
  const builder = new DynamoBuilder(stack);

  // Tables creation
  stack.addDynamoTable({
    tableName: DynamoTableNames.TableNames.Connections,
    table: builder.createTable({
      tableName: DynamoTableNames.TableNames.Connections,
      partitionKey: {
        name: "connectionId",
        type: "string",
      },
    }),
  });

  stack.addDynamoTable({
    tableName: DynamoTableNames.TableNames.Trains,
    table: builder.createTable({
      tableName: DynamoTableNames.TableNames.Trains,
      partitionKey: {
        name: "trainId",
        type: "string",
      },
    }),
  });

  // Lambda Permissions

  builder.grantWritePermissionsToLambdas({
    dynamoTable: stack.DynamoTables[DynamoTableNames.TableNames.Connections],
    lambdas: [
      stack.LambdaFunctions[LambdasFunctionNames.NotifyNewConnection],
      stack.LambdaFunctions[LambdasFunctionNames.NotifyDisconnection],
    ],
  });
};
