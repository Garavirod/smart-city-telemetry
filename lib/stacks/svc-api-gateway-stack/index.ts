import { App } from "aws-cdk-lib";
import { GenericStack } from "../../libs/cdk-builders/GenericStack";
import { ApiRestBuilder } from "../../libs/cdk-builders/api-gateway/ApiRestBuilder";
import { buildApiRestConstructs } from "./cdk/api/management";
import { DynamoBuilder } from "../../libs/cdk-builders/DynamoBuilder";
import { buildDynamoConstructs } from "./cdk/dynamo/management";
import { LambdaBuilder } from "../../libs/cdk-builders/LambdaBuilder";
import { buildLambdaConstructs } from "./cdk/lambda/management";
import { LambdasFunctionNames } from "../shared/enums/lambdas";
import { CognitoBuilder } from "../../libs/cdk-builders/CognitoBuilder";
import { buildCognitoConstructs } from "./cdk/cognito/management";
import { CognitoUsersPoolNames } from "../shared/enums/cognito";
import { DynamoTableNames } from "../shared/enums/dynamodb";


export const buildSvcApiGatewayStack = (app: App) => {
  const stackName = "SvcApiGateway";
  const stack = new GenericStack(app, stackName);

  const dynamoBuilder = new DynamoBuilder(stack);
  const lambdaBuilder = new LambdaBuilder(stack);
  const apiRestBuilder = new ApiRestBuilder(stack);
  const cognitoBuilder = new CognitoBuilder(stack);

  // Dynamo settings
  buildDynamoConstructs(dynamoBuilder);

  // Cognito settings
  buildCognitoConstructs(cognitoBuilder);

  //Lambda settings
  buildLambdaConstructs({
    builder: lambdaBuilder,
    dynamoTables: dynamoBuilder.getDynamoTables,
    cognitoClients: cognitoBuilder.getCognitoClients,
    cognitoPools: cognitoBuilder.getCognitoPools,
  });

  // Dynamo permissions settings
  dynamoBuilder.grantWritePermissionsToLambdas({
    dynamoTable: DynamoTableNames.TableNames.Users,
    lambdas: [
      lambdaBuilder.getLambdaFunctions[LambdasFunctionNames.GetUsers],
      lambdaBuilder.getLambdaFunctions[LambdasFunctionNames.SignUp],
      lambdaBuilder.getLambdaFunctions[LambdasFunctionNames.SignIn],
    ],
  });

  dynamoBuilder.grantReadPermissionsToLambdas({
    dynamoTable:DynamoTableNames.TableNames.Users,
    lambdas:[
      lambdaBuilder.getLambdaFunctions[LambdasFunctionNames.SignIn]
    ]
  })

  // Cognito permissions settings
  cognitoBuilder.grantLambdasCreateUsersPermission({
    userPoolNameId: CognitoUsersPoolNames.ManagementUsersPool,
    lambdaFunctions: [
      lambdaBuilder.getLambdaFunctions[LambdasFunctionNames.SignUp],
    ],
  });

  // ApiRest settings
  buildApiRestConstructs({
    builder: apiRestBuilder,
    lambdaFunctions: lambdaBuilder.getLambdaFunctions,
    cognitoPools: cognitoBuilder.getCognitoPools,
  });
};
