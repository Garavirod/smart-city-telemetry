import { LambdaBuilder } from "../../../../../libs/cdk-builders/LambdaBuilder";
import { LambdasFunctionNames } from "../../../../shared/enums/lambdas";
import {
  CognitoUsersPoolClientNames,
  CognitoUsersPoolNames,
} from "../../../../shared/enums/cognito";
import {
  DynamoTableIndex,
  DynamoTableNames,
} from "../../../../shared/enums/dynamodb";
import { ApiGatewayStack } from "../../../stack";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { WebSocketApiStack } from "../../../../svc-web-scoket-api-stack/stack";

export const runLambdaBuilder = (stack: ApiGatewayStack, webSocketApiStack:WebSocketApiStack) => {
  const builder = new LambdaBuilder(stack);
  const codeFilepathBase =
    "/svc-api-gateway-stack/services/handlers";

  // LAMBDAS
  const lambdaFunctions: Record<string, NodejsFunction> = {
    [LambdasFunctionNames.GetUsers]: builder.createNodeFunctionLambda({
      lambdaName: LambdasFunctionNames.GetUsers,
      pathStackHandlerCode: `${codeFilepathBase}/management/get-users.ts`,
      environment: {
        USERS_TABLE: stack.getTableId(DynamoTableNames.TableNames.Users),
      },
    }),
    [LambdasFunctionNames.SignUp]: builder.createNodeFunctionLambda({
      lambdaName: LambdasFunctionNames.SignUp,
      pathStackHandlerCode: `${codeFilepathBase}/management/sign-up-user.ts`,
      environment: {
        USERS_TABLE: stack.getTableId(DynamoTableNames.TableNames.Users),
        USER_MANAGEMENT_POOL_ID: stack.getCognitoUserPool(
          CognitoUsersPoolNames.ManagementUsersPool
        ).userPoolId,
        USER_POOL_MANAGEMENT_CLIENT_ID: stack.getCognitoUserClientId(
          CognitoUsersPoolClientNames.ManagementUsersPoolCli
        ),
      },
    }),
    [LambdasFunctionNames.SignIn]: builder.createNodeFunctionLambda({
      lambdaName: LambdasFunctionNames.SignIn,
      pathStackHandlerCode: `${codeFilepathBase}/management/sign-in-users.ts`,
      environment: {
        USERS_TABLE: stack.getTableId(DynamoTableNames.TableNames.Users),
        USER_MANAGEMENT_POOL_ID: stack.getCognitoUserPool(
          CognitoUsersPoolNames.ManagementUsersPool
        ).userPoolId,
        USER_POOL_MANAGEMENT_CLIENT_ID: stack.getCognitoUserClientId(
          CognitoUsersPoolClientNames.ManagementUsersPoolCli
        ),
        USERS_TABLE_EMAIL_INDEX:
          DynamoTableIndex.UsersTableIndex.EmailICreatedAtIndex,
      },
    }),
    [LambdasFunctionNames.GetDependencies]: builder.createNodeFunctionLambda({
      lambdaName: LambdasFunctionNames.GetDependencies,
      pathStackHandlerCode: `${codeFilepathBase}/management/get-dependencies.ts`,
      environment: {},
    }),
    [LambdasFunctionNames.PreSignUp]: builder.createNodeFunctionLambda({
      lambdaName: LambdasFunctionNames.PreSignUp,
      pathStackHandlerCode: `${codeFilepathBase}/management/pre-sign-up-users.ts`,
      environment: {},
    }),
    [LambdasFunctionNames.VerificationCode]: builder.createNodeFunctionLambda({
      lambdaName: LambdasFunctionNames.VerificationCode,
      pathStackHandlerCode: `${codeFilepathBase}/management/verification-code.ts`,
      environment: {
        USER_POOL_MANAGEMENT_CLIENT_ID: stack.getCognitoUserClientId(
          CognitoUsersPoolClientNames.ManagementUsersPoolCli
        ),
        USERS_TABLE: stack.getTableId(DynamoTableNames.TableNames.Users),
      },
    }),
    [LambdasFunctionNames.ResendCode]: builder.createNodeFunctionLambda({
      lambdaName: LambdasFunctionNames.ResendCode,
      pathStackHandlerCode: `${codeFilepathBase}/management/resend-code.ts`,
      environment: {
        USER_POOL_MANAGEMENT_CLIENT_ID: stack.getCognitoUserClientId(
          CognitoUsersPoolClientNames.ManagementUsersPoolCli
        ),
        USERS_TABLE: stack.getTableId(DynamoTableNames.TableNames.Users),
      },
    }),
    [LambdasFunctionNames.CaptureTrainCoords]: builder.createNodeFunctionLambda({
      lambdaName: LambdasFunctionNames.CaptureTrainCoords,
      pathStackHandlerCode: `${codeFilepathBase}/trains/capture-train-coords.ts`,
      environment: {
        WEB_SOCKET_ENDPOINT: webSocketApiStack.getWebSocketAPIEndpoint(),
      },
    }),
  };

  // DYNAMO PERMISSIONS
  builder.grantWritePermissionsToDynamo({
    dynamoTable: stack.getTable(DynamoTableNames.TableNames.Users),
    lambdas: [
      lambdaFunctions[LambdasFunctionNames.GetUsers],
      lambdaFunctions[LambdasFunctionNames.SignUp],
      lambdaFunctions[LambdasFunctionNames.SignIn],
      lambdaFunctions[LambdasFunctionNames.VerificationCode],
    ],
  });

  builder.grantReadPermissionsToLambdas({
    dynamoTable: stack.getTable(DynamoTableNames.TableNames.Users),
    lambdas: [
      lambdaFunctions[LambdasFunctionNames.SignIn],
      lambdaFunctions[LambdasFunctionNames.VerificationCode],
      lambdaFunctions[LambdasFunctionNames.ResendCode],
    ],
  });

  // COGNITO PERMISSIONS
  builder.grantLambdasCreateUsersPermission({
    userPool: stack.getCognitoUserPool(
      CognitoUsersPoolNames.ManagementUsersPool
    ),
    lambdaFunctions: [lambdaFunctions[LambdasFunctionNames.SignUp]],
  });

  builder.addPreSignupLambdaTrigger({
    userPool: stack.getCognitoUserPool(
      CognitoUsersPoolNames.ManagementUsersPool
    ),
    lambdaFunction: lambdaFunctions[LambdasFunctionNames.PreSignUp],
  });

  // Websocket permissions
  builder.grantPermissionToInvokeAPI({
    webSocket: webSocketApiStack.getWebSocket(),
    lambdaFunctions:[
      lambdaFunctions[LambdasFunctionNames.CaptureTrainCoords]
    ]
  })

  return { lambdaFunctions };
};
