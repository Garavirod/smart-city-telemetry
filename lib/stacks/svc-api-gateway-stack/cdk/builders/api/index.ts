import { ApiRestBuilder } from "../../../../../libs/cdk-builders/api-gateway/ApiRestBuilder";
import { buildCorsConfigurations } from "./cors";
import { createManagementApiResources } from "./resources/management/resources";
import { CognitoUsersPoolNames } from "../../../../shared/enums/cognito";
import { ApiAuthorizersNames } from "../../../../shared/enums/api-authorizers";
import { ApiGatewayStack } from "../../../stack";
import { RestApi } from "aws-cdk-lib/aws-apigateway";

export const runApiRestBuilder = (stack: ApiGatewayStack) => {
  const builder = new ApiRestBuilder(stack);
  const apiRestName = "TelemetryApi";

  const restApi: RestApi = builder.createApiRest({
    apiRestName,
    apiRestDescription: "General api rest for telemetry app",
    apiStage: "dev",
    cors: buildCorsConfigurations(),
  });

  builder.createCognitoAuthorizer({
    authorizerName: ApiAuthorizersNames.AdminAuthorizer,
    userPools: [
      stack.cognitoUserPools[CognitoUsersPoolNames.ManagementUsersPool],
    ],
  });

  builder.configureAPIKeyPlanUsage({
    apiRest: restApi,
    name: "TelemetryAPiKey",
    description: `APi key usage for ${apiRestName}`,
  });

  const managementResources = createManagementApiResources({
    lambdaFunctions: stack.lambdaFunctions,
  });

  builder.addApiResourceFromRoot({
    resources: managementResources,
    restApi: restApi,
  });
  /* builder.configureExportStack("ApiGatewayUrl", stack.apiRest); */

  return { restApi };
};
