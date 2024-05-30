import { AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { DynamoBuilder } from "../../../../libs/cdk-builders/DynamoBuilder";
import { UsersTableIndex } from "../../../shared/enums/dynamodb/dynamodb-indices";
import { DynamoTableNames } from "../../../shared/enums/dynamodb";

export const buildDynamoConstructs = (builder: DynamoBuilder) => {
  // Tables
  builder.createTable({
    tableName: DynamoTableNames.TableNames.Connections,
    partitionKey: {
      name: "connectionId",
      type: AttributeType.STRING,
    },
  });

};
