/* import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { GeneralApiGateway } from "./cdk/api/general-api-gateway";
import { ManagementLambdas } from "./cdk/lambda/management-lambdas";
import { manageMentResources } from "./cdk/api/resources/management/resources";
import { ManagementDynamoDB } from "./cdk/dynamo/management-dynamo";
import { ManagementDynamoKeyName } from "./cdk/dynamo/types";
import { ManagementLambdaKeyNames } from "./cdk/lambda/types";

export class SvcApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // constructs
    const managementLambdas = new ManagementLambdas(this);
    const apiGateway = new GeneralApiGateway(this);
    const managementDynamoDB = new ManagementDynamoDB(this);

    // Api gateway settings
    apiGateway.setLambdaHandlers(managementLambdas.getLambdaHandlers);
    apiGateway.addApiResourceFromRoot({ resources: manageMentResources });

    // DynamoDB settings
    managementDynamoDB.setLambdaHandlers(managementLambdas.getLambdaHandlers);
    managementDynamoDB.grantWritePermissionsToLambdas({
      keyNameTable: ManagementDynamoKeyName.Users,
      keyNameLambdas: [ManagementLambdaKeyNames.GetUsers],
    });
  }
}
 */

import { App } from "aws-cdk-lib";
import { GenericStack } from "./cdk/GenericStack";
import { ApiRestBuilder } from "./cdk/api/ApiRestBuilder";
import { buildApiRestConstructs } from "./cdk/api/management";
import { createManagementApiResources } from "./cdk/api/resources/management/resources";
import { DynamoBuilder } from "./cdk/dynamo/DynamoBuilder";
import { buildDynamoConstructs } from "./cdk/dynamo/management";
import { LambdaBuilder } from "./cdk/lambda/LambdaBuilder";
import { buildLambdaConstructs } from "./cdk/lambda/management";

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
    dynamoTable: "Users",
    lambdas: [
      lambdaBuilder.getLambdaFunctions["getUsers"],
      lambdaBuilder.getLambdaFunctions["getDependencies"],
    ],
  });

  // ApiRest settings
  const resources = createManagementApiResources({
    lambdaFunctions: lambdaBuilder.getLambdaFunctions,
  });
  buildApiRestConstructs({ builder: apiRestBuilder, resources });
};
