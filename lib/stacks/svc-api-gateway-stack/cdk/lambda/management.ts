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
    "/svc-api-gateway-stack/services/handlers/management";

  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.GetUsers,
    pathStackHandlerCode: `${codeFilepathBase}/get-users.ts`,
    environment: {
      USERS_TABLE:
        options.dynamoTables[DynamoTableNames.TableNames.Users].tableName,
    },
  });

  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.SignUp,
    pathStackHandlerCode: `${codeFilepathBase}/sign-up-user.ts`,
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
    lambdaName: LambdasFunctionNames.SignIn,
    pathStackHandlerCode: `${codeFilepathBase}/sign-in-users.ts`,
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
    lambdaName: LambdasFunctionNames.GetDependencies,
    pathStackHandlerCode: `${codeFilepathBase}/get-dependencies.ts`,
    environment: {},
  });

  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.PreSignUp,
    pathStackHandlerCode: `${codeFilepathBase}/pre-sign-up-users.ts`,
    environment: {},
  });

  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.VerificationCode,
    pathStackHandlerCode: `${codeFilepathBase}/verification-code.ts`,
    environment: {
      USER_POOL_MANAGEMENT_CLIENT_ID:
        options.cognitoClients[
          CognitoUsersPoolClientNames.ManagementUsersPoolCli
        ].userPoolClientId,
    },
  });
};
