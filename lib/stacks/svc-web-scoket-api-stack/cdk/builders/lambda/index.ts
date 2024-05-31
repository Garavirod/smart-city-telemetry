import { Table } from "aws-cdk-lib/aws-dynamodb";
import { LambdaBuilder } from "../../../../../libs/cdk-builders/LambdaBuilder";
import { LambdasFunctionNames } from "../../../../shared/enums/lambdas";
import {
  DynamoTableIndex,
  DynamoTableNames,
} from "../../../../shared/enums/dynamodb";

type lambdaConstructOptions = {
  builder: LambdaBuilder;
  dynamoTables: Record<string, Table>;
};

export const runLambdaBuilder = (options: lambdaConstructOptions) => {
  const codeFilepathBase = "/svc-web-socket-api-stack/services/handlers";

  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.NotifyNewConnection,
    pathStackHandlerCode: `${codeFilepathBase}/notify-new-connection.ts`,
    environment: {
      CONNECTIONS_TABLE:
        options.dynamoTables[DynamoTableNames.TableNames.Connections].tableName,
    },
  });

  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.NotifyDisconnection,
    pathStackHandlerCode: `${codeFilepathBase}/notify-disconnection.ts`,
    environment: {
      CONNECTIONS_TABLE:
        options.dynamoTables[DynamoTableNames.TableNames.Connections].tableName,
    },
  });

  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.NotifySignInConnection,
    pathStackHandlerCode: `${codeFilepathBase}/notify-sign-in-conn.ts`,
    environment: {
      USERS_TABLE:
        options.dynamoTables[DynamoTableNames.TableNames.Users].tableName,
      USERS_TABLE_EMAIL_INDEX:
        DynamoTableIndex.UsersTableIndex.EmailICreatedAtIndex,
    },
  });

  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.NotifyTrainLocation,
    pathStackHandlerCode: `${codeFilepathBase}/notify-train-location.ts`,
    environment: {
      TRAINS_TABLE:
        options.dynamoTables[DynamoTableNames.TableNames.Trains].tableName,
    },
  });
};
