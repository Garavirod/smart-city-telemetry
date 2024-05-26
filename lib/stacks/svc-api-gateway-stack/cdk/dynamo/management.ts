import { AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { DynamoBuilder } from "../../../../libs/cdk-builders/DynamoBuilder";
import { UsersTableIndex } from "../../../shared/enums/dynamodb/dynamodb-indices";
import { DynamoTableNames } from "../../../shared/enums/dynamodb";

export const buildDynamoConstructs = (builder: DynamoBuilder) => {
  // Tables
  builder.createTable({
    tableName: DynamoTableNames.TableNames.Users,
    partitionKey: {
      name: "userId",
      type: AttributeType.STRING,
    },
  });

  // GSI
  builder.createGSI({
    dynamoTable: DynamoTableNames.TableNames.Users,
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
  return builder;
};
