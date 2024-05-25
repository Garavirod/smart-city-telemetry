import { AttributeType, ProjectionType } from "aws-cdk-lib/aws-dynamodb";
import { DynamoBuilder } from "../../../../libs/cdk-builders/DynamoBuilder";
import { DynamoTableNames } from "../../../shared/enums/dynamodb";
import { UsersTableIndex } from "../../../../libs/clients/dynamodb/services/types";

export const buildDynamoConstructs = (builder: DynamoBuilder) => {
  // Tables
  builder.createTable({
    tableName: DynamoTableNames.Users,
    partitionKey: {
      name: "userId",
      type: AttributeType.STRING,
    },
  });

  // GSI
  builder.getDynamoTables[DynamoTableNames.Users].addGlobalSecondaryIndex({
    indexName: UsersTableIndex.EmailICreatedAtIndex,
    partitionKey: { name: "email", type: AttributeType.STRING },
    sortKey: { name: "createdAt", type: AttributeType.STRING },
    projectionType: ProjectionType.ALL,
  });

  return builder;
};
