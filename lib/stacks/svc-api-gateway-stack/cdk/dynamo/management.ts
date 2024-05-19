import { AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { DynamoBuilder } from "../../../../libs/cdk-builders/DynamoBuilder";
import { DynamoTableNames } from "./types";

export const buildDynamoConstructs = (builder:DynamoBuilder) => {
  builder.createTable({
    tableName:DynamoTableNames.Users,
    partitionKey: {
      name: "userId",
      type: AttributeType.STRING,
    },
  });

  return builder;
};
