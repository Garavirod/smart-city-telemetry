import { AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { DynamoBuilder } from "./DynamoBuilder";

export const buildDynamoConstructs = (builder:DynamoBuilder) => {
  builder.createTable({
    tableName: "Users",
    partitionKey: {
      name: "user_id",
      type: AttributeType.STRING,
    },
  });

  return builder;
};
