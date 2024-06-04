import { Table } from "aws-cdk-lib/aws-dynamodb";
import { DynamoBuilder } from "../../../../../libs/cdk-builders/DynamoBuilder";
import { DynamoTableNames } from "../../../../shared/enums/dynamodb";
import { LambdasFunctionNames } from "../../../../shared/enums/lambdas";
import { WebSocketApiStack } from "../../../stack";

export const runDynamoBuilder = (stack: WebSocketApiStack) => {
  const builder = new DynamoBuilder(stack);

  const dynamoTables: Record<string, Table> = {
    [DynamoTableNames.TableNames.Connections]: builder.createDynamoTable({
      tableName: DynamoTableNames.TableNames.Connections,
      partitionKey: {
        name: "connectionId",
        type: "string",
      },
    }),
    [DynamoTableNames.TableNames.Trains]: builder.createDynamoTable({
      tableName: DynamoTableNames.TableNames.Trains,
      partitionKey: {
        name: "trainId",
        type: "string",
      },
    }),
  };
  return { dynamoTables };
};
