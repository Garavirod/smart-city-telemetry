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
  SnsTopics,
} from "../../../../shared/types";
import { WebSocketApi } from "aws-cdk-lib/aws-apigatewayv2";
import { Stack } from "aws-cdk-lib";
import { SnsTopicNames } from "../../../../shared/enums/sns";
import { GlobalEnvironmentVars } from "../../../../../libs/environment";
type optionsResources = {
  stack: Stack;
  tables: DynamoDBTables;
  cognitoPools: CognitoUserPools;
  cognitoClients: CognitoUserPoolClients;
  webSocket: WebSocketApi;
  topics: SnsTopics;
};
export const createUsersLambdas = (options: optionsResources) => {
  const { stack, tables, cognitoPools, cognitoClients, webSocket, topics } =
    options;
  const codeFilepathBase = "/svc-api-gateway-stack/handlers/users";

  const webSocketEndpoint = `https://${webSocket.apiId}.execute-api.us-east-1.amazonaws.com/${GlobalEnvironmentVars.DEPLOY_ENVIRONMENT}`;

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
        NOTIFY_USER_ONLINE_TOPIC_ARN:
          topics[SnsTopicNames.NotifyNewUserOnlineTopic].topicArn,
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
    [LambdasFunctionNames.NotifyUserOnline]:
      LambdaCDKBuilder.createNodeFunctionLambda({
        scope: stack,
        lambdaName: LambdasFunctionNames.NotifyUserOnline,
        pathStackHandlerCode: `${codeFilepathBase}/notify-user-online-status.ts`,
        environment: {
          USER_POOL_MANAGEMENT_CLIENT_ID:
            cognitoClients[CognitoUsersPoolClientNames.ManagementUsersPoolCli]
              .userPoolClientId,
          CONNECTIONS_TABLE:
            tables[DynamoTableNames.TableNames.Connections].tableName,
          WEBSOCKET_API_ENDPOINT: webSocketEndpoint,
        },
      }),
    [LambdasFunctionNames.SignOut]: LambdaCDKBuilder.createNodeFunctionLambda({
      scope: stack,
      lambdaName: LambdasFunctionNames.SignOut,
      pathStackHandlerCode: `${codeFilepathBase}/sign-out.ts`,
      environment: {
        USERS_TABLE: tables[DynamoTableNames.TableNames.Users].tableName,
        NOTIFY_USER_ONLINE_TOPIC_ARN:
          topics[SnsTopicNames.NotifyNewUserOnlineTopic].topicArn,
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
      lambdaFunctions[LambdasFunctionNames.SignOut],
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

  LambdaCDKBuilder.grantReadPermissionsToDynamo({
    dynamoTable: tables[DynamoTableNames.TableNames.Connections],
    lambdas: [lambdaFunctions[LambdasFunctionNames.NotifyUserOnline]],
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
    lambdaFunctions: [lambdaFunctions[LambdasFunctionNames.NotifyUserOnline]],
  });

  // SNS PERMISSIONS
  LambdaCDKBuilder.grantTopicPublishPermissions({
    lambdas: [
      lambdaFunctions[LambdasFunctionNames.SignIn],
      lambdaFunctions[LambdasFunctionNames.SignOut],
    ],
    topic: topics[SnsTopicNames.NotifyNewUserOnlineTopic],
  });
  LambdaCDKBuilder.addSnsEventSource({
    lambda: lambdaFunctions[LambdasFunctionNames.NotifyUserOnline],
    topic: topics[SnsTopicNames.NotifyNewUserOnlineTopic],
  });
  return lambdaFunctions;
};
