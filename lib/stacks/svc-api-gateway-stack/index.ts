import { App } from "aws-cdk-lib";
import { GenericStack } from "../../libs/cdk-builders/GenericStack";
import { ApiRestBuilder } from "../../libs/cdk-builders/ApiRestBuilder";
import { buildApiRestConstructs } from "./cdk/api/management";
import { createManagementApiResources } from "./cdk/api/resources/management/resources";
import { DynamoBuilder } from "../../libs/cdk-builders/DynamoBuilder";
import { buildDynamoConstructs } from "./cdk/dynamo/management";
import { LambdaBuilder } from "../../libs/cdk-builders/LambdaBuilder";
import { buildLambdaConstructs } from "./cdk/lambda/management";
import { LambdasFunctionNames } from "./cdk/lambda/types";
import { DynamoTableNames } from "./cdk/dynamo/types";

export const buildSvcApiGatewayStack = (app: App) => {
  const stackName = "SvcApiGateway";
  const stack = new GenericStack(app, stackName);

  const dynamoBuilder = new DynamoBuilder(stack);
  const lambdaBuilder = new LambdaBuilder(stack);
  const apiRestBuilder = new ApiRestBuilder(stack);

  // Dynamo settings
  buildDynamoConstructs(dynamoBuilder);

  //Lambda settings
  buildLambdaConstructs({
    builder: lambdaBuilder,
    dynamoTables: dynamoBuilder.getDynamoTables,
  });

  // Dynamo permissions settings
  dynamoBuilder.grantWritePermissionsToLambdas({
    dynamoTable: DynamoTableNames.Users,
    lambdas: [lambdaBuilder.getLambdaFunctions[LambdasFunctionNames.GetUsers]],
  });

  // ApiRest settings
  const resources = createManagementApiResources({
    lambdaFunctions: lambdaBuilder.getLambdaFunctions,
  });
  buildApiRestConstructs({ builder: apiRestBuilder, resources });
};
