import { AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { DynamoBuilder } from "./DynamoBuilder";
import { DynamoTableNames } from "./types";

export const buildDynamoConstructs = (builder:DynamoBuilder) => {
  builder.createTable({
    tableName:DynamoTableNames.Users,
    partitionKey: {
      name: "user_id",
      type: AttributeType.STRING,
    },
  });

  return builder;
};
