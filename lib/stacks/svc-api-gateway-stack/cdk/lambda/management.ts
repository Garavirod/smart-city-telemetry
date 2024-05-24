import { Table } from "aws-cdk-lib/aws-dynamodb";
import { LambdaBuilder } from "../../../../libs/cdk-builders/LambdaBuilder";
import { DynamoTableNames } from "../../../shared/enums/dynamodb";
import { LambdasFunctionNames } from "../../../shared/enums/lambdas";

import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import {
  CognitoUsersPoolClientNames,
  CognitoUsersPoolNames,
} from "../../../shared/enums/cognito";

type lambdaConstructOptions = {
  builder: LambdaBuilder;
  dynamoTables: Record<string, Table>;
  cognitoPools: Record<string, UserPool>;
  cognitoClients: Record<string, UserPoolClient>;
};

export const buildLambdaConstructs = (options: lambdaConstructOptions) => {
  const codeFilepathBase =
    "/svc-api-gateway-stack/services/handlers/management";

  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.GetUsers,
    pathStackHandlerCode: `${codeFilepathBase}/get-users.ts`,
    environment: {
      USERS_TABLE: options.dynamoTables[DynamoTableNames.Users].tableName,
    },
  });

  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.RegisterNewUser,
    pathStackHandlerCode: `${codeFilepathBase}/register-new-user.ts`,
    environment: {
      USERS_TABLE: options.dynamoTables[DynamoTableNames.Users].tableName,
      USER_MANAGEMENT_POOL_ID:
        options.cognitoPools[CognitoUsersPoolNames.ManagementUsersPool]
          .userPoolId,
      USER_POOL_MANAGEMENT_CLIENT_ID:
        options.cognitoClients[
          CognitoUsersPoolClientNames.ManagementUsersPoolCli
        ].userPoolClientId,
      USER_COMMON_POOL_ID:
        options.cognitoPools[CognitoUsersPoolNames.CommonUsersPool].userPoolId,
      USER_POOL_COMMON_CLIENT_ID:
        options.cognitoClients[CognitoUsersPoolClientNames.CommonUsersPoolCli]
          .userPoolClientId,
    },
  });

  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.GetDependencies,
    pathStackHandlerCode: `${codeFilepathBase}/get-dependencies.ts`,
    environment: {},
  });
};
