import { UserPool } from "aws-cdk-lib/aws-cognito";
import { ApiRestBuilder } from "../../../../libs/cdk-builders/api-gateway/ApiRestBuilder";
import { buildCorsConfigurations } from "./cors";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { createManagementApiResources } from "./resources/management/resources";
import { CognitoUsersPoolNames } from "../../../shared/enums/cognito";
import { ApiAuthorizersNames } from "../../../shared/enums/api-authorizers";


type buildApiRestConstructOptions = {
  builder: ApiRestBuilder;
  cognitoPools: Record<string, UserPool>;
  lambdaFunctions: Record<string, NodejsFunction>;
};

export const buildApiRestConstructs = (
  options: buildApiRestConstructOptions
) => {
  const apiRestName = "TelemetryApi";

  options.builder.createApiRest({
    apiRestName,
    apiRestDescription: "General api rest fro telemetry app",
    apiStage: "dev",
    cors: buildCorsConfigurations(),
  });

  options.builder.createCognitoAuthorizer({
    authorizerName: ApiAuthorizersNames.AdminAuthorizer,
    userPools: [
      options.cognitoPools[CognitoUsersPoolNames.ManagementUsersPool],
      options.cognitoPools[CognitoUsersPoolNames.CommonUsersPool],
    ],
  });

  options.builder.createCognitoAuthorizer({
    authorizerName: ApiAuthorizersNames.CommonAuthorizer,
    userPools: [options.cognitoPools[CognitoUsersPoolNames.CommonUsersPool]],
  });

  options.builder.configureAPIKeyPlanUsage({
    name: "TelemetryAPiKey",
    description: `APi key usage for ${apiRestName}`,
  });

  const managementResources = createManagementApiResources({
    lambdaFunctions: options.lambdaFunctions,
  });

  options.builder.addApiResourceFromRoot({ resources: managementResources });

  options.builder.configureExportStack("ApiGatewayUrl");
};
