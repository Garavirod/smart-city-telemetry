import { buildCorsConfigurations } from "./cors";
import { createUsersApiResources } from "./resources/users/resources";
import { CognitoUsersPoolNames } from "../../../../shared/enums/cognito";
import { ApiAuthorizersNames } from "../../../../shared/enums/api-authorizers";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { createDependenciesApiResources } from "./resources/dependencies/resources";
import { createTrainApiResources } from "./resources/train/resources";
import { CognitoUserPools, LambdaFunctions } from "../../../../shared/types";
import { ApiRestCDKBuilder } from "../../../../../libs/cdk-builders/api-gateway";
import { getValidators } from "./validators";
import { Stack } from "aws-cdk-lib";
import { GlobalEnvironmentVars } from "../../../../../libs/environment";
import { getModels } from "./models";

type optionResources = {
  lambdas: LambdaFunctions;
  stack: Stack;
  cognitoPools: CognitoUserPools;
};
export const createRestApi = (options: optionResources) => {
  const { lambdas, stack, cognitoPools } = options;
  const apiRestName = "TelemetryApi";

  const restApi: RestApi = ApiRestCDKBuilder.createApiRest({
    scope: stack,
    apiRestName,
    apiRestDescription: "General api rest for telemetry app",
    apiStage: GlobalEnvironmentVars.DEPLOY_ENVIRONMENT,
    cors: buildCorsConfigurations(),
  });

  ApiRestCDKBuilder.configureAPIKeyPlanUsage({
    apiRest: restApi,
    description: `Api key for api rest ${apiRestName}`,
    scope: stack,
    name: "TelemetryApiKey",
  });
  // Define api authorizer
  const apiAuthorizer = ApiRestCDKBuilder.createCognitoAuthorizer({
    scope: stack,
    authorizerName: ApiAuthorizersNames.AdminAuthorizer,
    userPools: [cognitoPools[CognitoUsersPoolNames.ManagementUsersPool]],
  });

  // Fetch api validators
  const { apiUsersValidators, apiDependenciesValidators, apiTrainsValidators } =
    getValidators(restApi);

  // Fetch api models
  const { apiDependenciesModels, apiTrainsModels, apiUsersModels } = getModels({
    scope: options.stack,
    restApi,
  });

  // Create api endpoint resources
  const usersApiEndpointResources = createUsersApiResources({
    lambdaFunctions: lambdas,
    validators: apiUsersValidators,
    cognitoAuthorizer: apiAuthorizer,
    apiModels: apiUsersModels,
  });
  const dependenciesApiEndpointResources = createDependenciesApiResources({
    lambdaFunctions: lambdas,
    validators: apiDependenciesValidators,
    cognitoAuthorizer: apiAuthorizer,
    apiModels: apiDependenciesModels,
  });
  const trainApiEndpointResources = createTrainApiResources({
    lambdaFunctions: lambdas,
    validators: apiTrainsValidators,
    cognitoAuthorizer: apiAuthorizer,
    apiModels: apiTrainsModels,
  });

  // Link api endpoint resources to api rest
  ApiRestCDKBuilder.addApiResourceFromRoot({
    scope: stack,
    resources: usersApiEndpointResources,
    restApi: restApi,
  });

  ApiRestCDKBuilder.addApiResourceFromRoot({
    scope: stack,
    resources: dependenciesApiEndpointResources,
    restApi: restApi,
  });

  ApiRestCDKBuilder.addApiResourceFromRoot({
    scope: stack,
    resources: trainApiEndpointResources,
    restApi: restApi,
  });

  return restApi;
};
