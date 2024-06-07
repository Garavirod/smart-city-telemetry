import {
  ConnectionsTableIndex,
  UsersTableIndex,
} from "../../../../shared/enums/dynamodb/dynamodb-indices";
import { DynamoTableNames } from "../../../../shared/enums/dynamodb";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { DynamoCDKBuilder } from "../../../../../libs/cdk-builders/dynamodb";
import { Stack } from "aws-cdk-lib";

export const createTables = (stack: Stack) => {
  // TABLES
  const dynamoTables: Record<string, Table> = {
    [DynamoTableNames.TableNames.Users]: DynamoCDKBuilder.createDynamoTable({
      scope: stack,
      tableName: DynamoTableNames.TableNames.Users,
      partitionKey: {
        name: "userId",
        type: "string",
      },
    }),
    [DynamoTableNames.TableNames.Connections]:
      DynamoCDKBuilder.createDynamoTable({
        scope: stack,
        tableName: DynamoTableNames.TableNames.Connections,
        partitionKey: {
          name: "connectionId",
          type: "string",
        },
      }),
    [DynamoTableNames.TableNames.Trains]: DynamoCDKBuilder.createDynamoTable({
      scope: stack,
      tableName: DynamoTableNames.TableNames.Trains,
      partitionKey: {
        name: "trainId",
        type: "string",
      },
    }),
  };

  // GSI
  DynamoCDKBuilder.createGSI({
    dynamoTable: dynamoTables[DynamoTableNames.TableNames.Users],
    indexName: UsersTableIndex.EmailICreatedAtIndex,
    partitionKey: {
      prop: "email",
      type: "string",
    },
    sortKey: {
      prop: "createdAt",
      type: "string",
    },
  });

  DynamoCDKBuilder.createGSI({
    dynamoTable: dynamoTables[DynamoTableNames.TableNames.Connections],
    indexName: ConnectionsTableIndex.ConnectionTypeIndex,
    partitionKey: {
      prop: "connectionType",
      type: "string",
    },
  });

  return dynamoTables;
};
