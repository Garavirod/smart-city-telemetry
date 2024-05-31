import { AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { DynamoBuilder } from "../../../../../libs/cdk-builders/DynamoBuilder";
import { DynamoTableNames } from "../../../../shared/enums/dynamodb";

export const runDynamoBuilder = (builder: DynamoBuilder) => {
  // Tables
  builder.createTable({
    tableName: DynamoTableNames.TableNames.Connections,
    partitionKey: {
      name: "connectionId",
      type: AttributeType.STRING,
    },
  });

  builder.createTable({
    tableName: DynamoTableNames.TableNames.Trains,
    partitionKey: {
      name: "trainId",
      type: AttributeType.STRING,
    },
  });
};
