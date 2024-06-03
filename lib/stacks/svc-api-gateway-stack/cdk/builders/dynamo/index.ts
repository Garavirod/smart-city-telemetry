import { DynamoBuilder } from "../../../../../libs/cdk-builders/DynamoBuilder";
import { UsersTableIndex } from "../../../../shared/enums/dynamodb/dynamodb-indices";
import { DynamoTableNames } from "../../../../shared/enums/dynamodb";
import { ApiGatewayStack } from "../../../stack";
import { Table } from "aws-cdk-lib/aws-dynamodb";

export const runDynamoBuilder = (stack: ApiGatewayStack) => {
  const builder = new DynamoBuilder(stack);

  // TABLES
  const dynamoTables: Record<string, Table> = {
    [DynamoTableNames.TableNames.Users]: builder.createDynamoTable({
      tableName: DynamoTableNames.TableNames.Users,
      partitionKey: {
        name: "userId",
        type: "string",
      },
    }),
  };

  // GSI
  builder.createGSI({
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

  return {dynamoTables};
};
