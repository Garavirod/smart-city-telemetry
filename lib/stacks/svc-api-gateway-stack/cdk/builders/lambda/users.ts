import { LambdasFunctionNames } from "../../../../shared/enums/lambdas";
import {
  CognitoUsersPoolClientNames,
  CognitoUsersPoolNames,
} from "../../../../shared/enums/cognito";
import {
  DynamoTableIndex,
  DynamoTableNames,
} from "../../../../shared/enums/dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaCDKBuilder } from "../../../../../libs/cdk-builders/lambda";
import {
  CognitoUserPoolClients,
  CognitoUserPools,
  DynamoDBTables,
} from "../../../../shared/types";
import { WebSocketApi } from "aws-cdk-lib/aws-apigatewayv2";
import { Stack } from "aws-cdk-lib";
type optionsResources = {
  stack: Stack;
  tables: DynamoDBTables;
  cognitoPools: CognitoUserPools;
  cognitoClients: CognitoUserPoolClients;
  webSocket: WebSocketApi;
};
export const createUsersLambdas = (options: optionsResources) => {
  const { stack, tables, cognitoPools, cognitoClients, webSocket } = options;
  const codeFilepathBase = "/svc-api-gateway-stack/handlers/users";

  // LAMBDAS
  const lambdaFunctions: Record<string, NodejsFunction> = {
    [LambdasFunctionNames.GetUsers]: LambdaCDKBuilder.createNodeFunctionLambda({
      scope: stack,
      lambdaName: LambdasFunctionNames.GetUsers,
      pathStackHandlerCode: `${codeFilepathBase}/get-users.ts`,
      environment: {
        USERS_TABLE: tables[DynamoTableNames.TableNames.Users].tableName,
      },
    }),
    [LambdasFunctionNames.SignUp]: LambdaCDKBuilder.createNodeFunctionLambda({
      scope: stack,
      lambdaName: LambdasFunctionNames.SignUp,
      pathStackHandlerCode: `${codeFilepathBase}/sign-up-user.ts`,
      environment: {
        USERS_TABLE: tables[DynamoTableNames.TableNames.Users].tableName,
        USER_MANAGEMENT_POOL_ID:
          cognitoPools[CognitoUsersPoolNames.ManagementUsersPool].userPoolId,
        USER_POOL_MANAGEMENT_CLIENT_ID:
          cognitoClients[CognitoUsersPoolClientNames.ManagementUsersPoolCli]
            .userPoolClientId,
      },
    }),
    [LambdasFunctionNames.SignIn]: LambdaCDKBuilder.createNodeFunctionLambda({
      scope: stack,
      lambdaName: LambdasFunctionNames.SignIn,
      pathStackHandlerCode: `${codeFilepathBase}/sign-in-users.ts`,
      environment: {
        USERS_TABLE: tables[DynamoTableNames.TableNames.Users].tableName,
        USER_MANAGEMENT_POOL_ID:
          cognitoPools[CognitoUsersPoolNames.ManagementUsersPool].userPoolId,
        USER_POOL_MANAGEMENT_CLIENT_ID:
          cognitoClients[CognitoUsersPoolClientNames.ManagementUsersPoolCli]
            .userPoolClientId,
        USERS_TABLE_EMAIL_INDEX:
          DynamoTableIndex.UsersTableIndex.EmailICreatedAtIndex,
        WEBSOCKET_API_ENDPOINT: webSocket.apiEndpoint,
      },
    }),
    [LambdasFunctionNames.PreSignUp]: LambdaCDKBuilder.createNodeFunctionLambda(
      {
        scope: stack,
        lambdaName: LambdasFunctionNames.PreSignUp,
        pathStackHandlerCode: `${codeFilepathBase}/pre-sign-up-users.ts`,
        environment: {},
      }
    ),
    [LambdasFunctionNames.VerificationCode]:
      LambdaCDKBuilder.createNodeFunctionLambda({
        scope: stack,
        lambdaName: LambdasFunctionNames.VerificationCode,
        pathStackHandlerCode: `${codeFilepathBase}/verification-code.ts`,
        environment: {
          USER_POOL_MANAGEMENT_CLIENT_ID:
            cognitoClients[CognitoUsersPoolClientNames.ManagementUsersPoolCli]
              .userPoolClientId,
          USERS_TABLE: tables[DynamoTableNames.TableNames.Users].tableName,
        },
      }),
    [LambdasFunctionNames.ResendCode]:
      LambdaCDKBuilder.createNodeFunctionLambda({
        scope: stack,
        lambdaName: LambdasFunctionNames.ResendCode,
        pathStackHandlerCode: `${codeFilepathBase}/resend-code.ts`,
        environment: {
          USER_POOL_MANAGEMENT_CLIENT_ID:
            cognitoClients[CognitoUsersPoolClientNames.ManagementUsersPoolCli]
              .userPoolClientId,
          USERS_TABLE: tables[DynamoTableNames.TableNames.Users].tableName,
        },
      }),
  };

  // DYNAMO PERMISSIONS
  LambdaCDKBuilder.grantWritePermissionsToDynamo({
    dynamoTable: tables[DynamoTableNames.TableNames.Users],
    lambdas: [
      lambdaFunctions[LambdasFunctionNames.GetUsers],
      lambdaFunctions[LambdasFunctionNames.SignUp],
      lambdaFunctions[LambdasFunctionNames.SignIn],
      lambdaFunctions[LambdasFunctionNames.VerificationCode],
    ],
  });

  LambdaCDKBuilder.grantReadPermissionsToDynamo({
    dynamoTable: tables[DynamoTableNames.TableNames.Users],
    lambdas: [
      lambdaFunctions[LambdasFunctionNames.SignIn],
      lambdaFunctions[LambdasFunctionNames.VerificationCode],
      lambdaFunctions[LambdasFunctionNames.ResendCode],
    ],
  });

  LambdaCDKBuilder.grantWritePermissionsToDynamo({
    dynamoTable: tables[DynamoTableNames.TableNames.Connections],
    lambdas: [lambdaFunctions[LambdasFunctionNames.SignIn]],
  });

  // COGNITO PERMISSIONS
  LambdaCDKBuilder.grantLambdasCreateUsersPermission({
    userPool: cognitoPools[CognitoUsersPoolNames.ManagementUsersPool],
    lambdaFunctions: [lambdaFunctions[LambdasFunctionNames.SignUp]],
  });

  LambdaCDKBuilder.addPreSignupLambdaTrigger({
    userPool: cognitoPools[CognitoUsersPoolNames.ManagementUsersPool],
    lambdaFunction: lambdaFunctions[LambdasFunctionNames.PreSignUp],
  });

  // WEBSOCKET API PERMISSIONS
  LambdaCDKBuilder.grantPermissionToInvokeAPI({
    webSocket,
    lambdaFunctions: [lambdaFunctions[LambdasFunctionNames.SignIn]],
  });

  return lambdaFunctions;
};
