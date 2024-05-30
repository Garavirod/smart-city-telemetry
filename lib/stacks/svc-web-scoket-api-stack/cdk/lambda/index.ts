import { Table } from "aws-cdk-lib/aws-dynamodb";
import { LambdaBuilder } from "../../../../libs/cdk-builders/LambdaBuilder";
import { LambdasFunctionNames } from "../../../shared/enums/lambdas";

import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import {
  CognitoUsersPoolClientNames,
  CognitoUsersPoolNames,
} from "../../../shared/enums/cognito";
import {
  DynamoTableIndex,
  DynamoTableNames,
} from "../../../shared/enums/dynamodb";

type lambdaConstructOptions = {
  builder: LambdaBuilder;
  dynamoTables: Record<string, Table>;
  cognitoPools: Record<string, UserPool>;
  cognitoClients: Record<string, UserPoolClient>;
};

export const buildLambdaConstructs = (options: lambdaConstructOptions) => {
  const codeFilepathBase =
    "/svc-web-socket-api-stack/services/handlers";

  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.NotifyNewConnection,
    pathStackHandlerCode: `${codeFilepathBase}/notify-new-connection.ts`,
    environment: {
      USERS_TABLE:
        options.dynamoTables[DynamoTableNames.TableNames.Users].tableName,
    },
  });

  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.NotifyDisconnection,
    pathStackHandlerCode: `${codeFilepathBase}/notify-disconnection.ts`,
    environment: {
      USERS_TABLE:
        options.dynamoTables[DynamoTableNames.TableNames.Users].tableName,
      USER_MANAGEMENT_POOL_ID:
        options.cognitoPools[CognitoUsersPoolNames.ManagementUsersPool]
          .userPoolId,
      USER_POOL_MANAGEMENT_CLIENT_ID:
        options.cognitoClients[
          CognitoUsersPoolClientNames.ManagementUsersPoolCli
        ].userPoolClientId,
    },
  });

  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.NotifySignInConnection,
    pathStackHandlerCode: `${codeFilepathBase}/notify-sign-in-conn.ts`,
    environment: {
      USERS_TABLE:
        options.dynamoTables[DynamoTableNames.TableNames.Users].tableName,
      USER_MANAGEMENT_POOL_ID:
        options.cognitoPools[CognitoUsersPoolNames.ManagementUsersPool]
          .userPoolId,
      USER_POOL_MANAGEMENT_CLIENT_ID:
        options.cognitoClients[
          CognitoUsersPoolClientNames.ManagementUsersPoolCli
        ].userPoolClientId,
      USERS_TABLE_EMAIL_INDEX:
        DynamoTableIndex.UsersTableIndex.EmailICreatedAtIndex,
    },
  });

  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.NotifyTrainLocation,
    pathStackHandlerCode: `${codeFilepathBase}/notify-train-location.ts`,
    environment: {},
  });

};
