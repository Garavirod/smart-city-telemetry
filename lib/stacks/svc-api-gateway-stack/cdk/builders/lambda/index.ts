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

export const runLambdaBuilder = (stack: ApiGatewayStack) => {
  const builder = new LambdaBuilder(stack);
  const codeFilepathBase =
    "/svc-api-gateway-stack/services/handlers/management";

  // LAMBDAS
  const lambdaFunctions: Record<string, NodejsFunction> = {
    [LambdasFunctionNames.GetUsers]: builder.createNodeFunctionLambda({
      lambdaName: LambdasFunctionNames.GetUsers,
      pathStackHandlerCode: `${codeFilepathBase}/get-users.ts`,
      environment: {
        USERS_TABLE:
          stack.dynamoTables[DynamoTableNames.TableNames.Users].tableName,
      },
    }),
    [LambdasFunctionNames.SignUp]: builder.createNodeFunctionLambda({
      lambdaName: LambdasFunctionNames.SignUp,
      pathStackHandlerCode: `${codeFilepathBase}/sign-up-user.ts`,
      environment: {
        USERS_TABLE:
          stack.dynamoTables[DynamoTableNames.TableNames.Users].tableName,
        USER_MANAGEMENT_POOL_ID:
          stack.cognitoUserPools[CognitoUsersPoolNames.ManagementUsersPool]
            .userPoolId,
        USER_POOL_MANAGEMENT_CLIENT_ID:
          stack.cognitoUserPoolClients[
            CognitoUsersPoolClientNames.ManagementUsersPoolCli
          ].userPoolClientId,
      },
    }),
    [LambdasFunctionNames.SignIn]: builder.createNodeFunctionLambda({
      lambdaName: LambdasFunctionNames.SignIn,
      pathStackHandlerCode: `${codeFilepathBase}/sign-in-users.ts`,
      environment: {
        USERS_TABLE:
          stack.dynamoTables[DynamoTableNames.TableNames.Users].tableName,
        USER_MANAGEMENT_POOL_ID:
          stack.cognitoUserPools[CognitoUsersPoolNames.ManagementUsersPool]
            .userPoolId,
        USER_POOL_MANAGEMENT_CLIENT_ID:
          stack.cognitoUserPoolClients[
            CognitoUsersPoolClientNames.ManagementUsersPoolCli
          ].userPoolClientId,
        USERS_TABLE_EMAIL_INDEX:
          DynamoTableIndex.UsersTableIndex.EmailICreatedAtIndex,
      },
    }),
    [LambdasFunctionNames.GetDependencies]: builder.createNodeFunctionLambda({
      lambdaName: LambdasFunctionNames.GetDependencies,
      pathStackHandlerCode: `${codeFilepathBase}/get-dependencies.ts`,
      environment: {},
    }),
    [LambdasFunctionNames.PreSignUp]: builder.createNodeFunctionLambda({
      lambdaName: LambdasFunctionNames.PreSignUp,
      pathStackHandlerCode: `${codeFilepathBase}/pre-sign-up-users.ts`,
      environment: {},
    }),
    [LambdasFunctionNames.VerificationCode]: builder.createNodeFunctionLambda({
      lambdaName: LambdasFunctionNames.VerificationCode,
      pathStackHandlerCode: `${codeFilepathBase}/verification-code.ts`,
      environment: {
        USER_POOL_MANAGEMENT_CLIENT_ID:
          stack.cognitoUserPoolClients[
            CognitoUsersPoolClientNames.ManagementUsersPoolCli
          ].userPoolClientId,
        USERS_TABLE:
          stack.dynamoTables[DynamoTableNames.TableNames.Users].tableName,
      },
    }),
    [LambdasFunctionNames.ResendCode]: builder.createNodeFunctionLambda({
      lambdaName: LambdasFunctionNames.ResendCode,
      pathStackHandlerCode: `${codeFilepathBase}/resend-code.ts`,
      environment: {
        USER_POOL_MANAGEMENT_CLIENT_ID:
          stack.cognitoUserPoolClients[
            CognitoUsersPoolClientNames.ManagementUsersPoolCli
          ].userPoolClientId,
        USERS_TABLE:
          stack.dynamoTables[DynamoTableNames.TableNames.Users].tableName,
      },
    }),
  };

  // DYNAMO PERMISSIONS
  builder.grantWritePermissionsToLambdas({
    dynamoTable: stack.dynamoTables[DynamoTableNames.TableNames.Users],
    lambdas: [
      lambdaFunctions[LambdasFunctionNames.GetUsers],
      lambdaFunctions[LambdasFunctionNames.SignUp],
      lambdaFunctions[LambdasFunctionNames.SignIn],
      lambdaFunctions[LambdasFunctionNames.VerificationCode],
    ],
  });

  builder.grantReadPermissionsToLambdas({
    dynamoTable: stack.dynamoTables[DynamoTableNames.TableNames.Users],
    lambdas: [
      lambdaFunctions[LambdasFunctionNames.SignIn],
      lambdaFunctions[LambdasFunctionNames.VerificationCode],
      lambdaFunctions[LambdasFunctionNames.ResendCode],
    ],
  });

  // COGNITO PERMISSIONS
  builder.grantLambdasCreateUsersPermission({
    userPool: stack.cognitoUserPools[CognitoUsersPoolNames.ManagementUsersPool],
    lambdaFunctions: [lambdaFunctions[LambdasFunctionNames.SignUp]],
  });

  builder.addPreSignupLambdaTrigger({
    userPool: stack.cognitoUserPools[CognitoUsersPoolNames.ManagementUsersPool],
    lambdaFunction: lambdaFunctions[LambdasFunctionNames.PreSignUp],
  });

  return {lambdaFunctions};
};
