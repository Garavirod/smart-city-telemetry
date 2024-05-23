import { Table } from "aws-cdk-lib/aws-dynamodb";
import { LambdaBuilder } from "../../../../libs/cdk-builders/LambdaBuilder";
import { DynamoTableNames } from "../dynamo/types";
import { LambdasFunctionNames } from "./types";
import {
  CognitoUsersPoolClientNames,
  CognitoUsersPoolNames,
} from "../cognito/types";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";

type lambdaConstructOptions = {
  builder: LambdaBuilder;
  dynamoTables?: Record<string, Table>;
  cognitoPools?: Record<string, UserPool>;
  cognitoClients?: Record<string, UserPoolClient>;
};

export const buildLambdaConstructs = (options: lambdaConstructOptions) => {
  const codeFilepathBase =
    "/svc-api-gateway-stack/services/handlers/management";

  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.GetUsers,
    pathStackHandlerCode: `${codeFilepathBase}/get-users.ts`,
    environment: {
      USERS_TABLE: `${
        options.dynamoTables
          ? options.dynamoTables[DynamoTableNames.Users].tableName
          : ""
      }`,
    },
  });

  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.RegisterNewUser,
    pathStackHandlerCode: `${codeFilepathBase}/register-new-user.ts`,
    environment: {
      USERS_TABLE: `${
        options.dynamoTables
          ? options.dynamoTables[DynamoTableNames.Users].tableName
          : ""
      }`,
      USER_POOL_ID: `${
        options.cognitoPools
          ? options.cognitoPools[CognitoUsersPoolNames.ManagementUsersPool]
              .userPoolId
          : ""
      }`,
      USER_POOL_CLIENT_ID: `${
        options.cognitoClients
          ? options.cognitoClients[
              CognitoUsersPoolClientNames.ManagementUsersPoolCli
            ].userPoolClientId
          : ""
      }`,
    },
  });

  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.GetDependencies,
    pathStackHandlerCode: `${codeFilepathBase}/get-dependencies.ts`,
    environment: {},
  });
};
