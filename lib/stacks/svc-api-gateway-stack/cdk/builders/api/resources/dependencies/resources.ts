import {
  AuthorizationType,
  ResourcesAPI,
} from "../../../../../../../libs/cdk-builders/api-gateway/types";
import { ApiAuthorizersNames } from "../../../../../../shared/enums/api-authorizers";
import { ValidatorNames } from "../../../../../../shared/enums/api-validators";
import { LambdasFunctionNames } from "../../../../../../shared/enums/lambdas";
import { simplePaginationParams } from "../../../../../../shared/utils/simple-paginator-params";
import { createResourcesOptions } from "../types";

export const createDependenciesApiResources = (
  options: createResourcesOptions
) => {
  const resources: ResourcesAPI = {
    pathPart: "dependencies",
    methods: [
      {
        httpMethod: "GET",
        lambdaFunction:
          options.lambdaFunctions[LambdasFunctionNames.GetDependencies],
        isproxy: true,
        requestParams: {
          validatorNameId: ValidatorNames.SimplePaginationValidator,
          params: simplePaginationParams,
        },
        auth: {
          type: AuthorizationType.Authorization,
          apiAuthorizer: options.cognitoAuthorizer,
        },
      },
    ],
    /* resources: [
        {
          pathPart: "{dependency_id}",
          methods: [
            {
              httpMethod: "GET",
              lambdaIntegration:
                LambdasManagementIntegrations.Instance
                  .getDependenciesLambdaIntegration,
            },
          ],
        },
        {
          pathPart: "status",
          methods: [],
          resources: [
            {
              pathPart: "{dependency_id}",
              methods: [
                {
                  httpMethod: "GET",
                  lambdaIntegration:
                    LambdasManagementIntegrations.Instance
                      .getDependenciesLambdaIntegration,
                },
              ],
            },
          ],
        },
        {
          pathPart: "map-api-keys",
          methods: [],
          resources: [
            {
              pathPart: "{dependency_id}",
              methods: [
                {
                  httpMethod: "POST",
                  lambdaIntegration:
                    LambdasManagementIntegrations.Instance
                      .getDependenciesLambdaIntegration,
                },
                {
                  httpMethod: "DELETE",
                  lambdaIntegration:
                    LambdasManagementIntegrations.Instance
                      .getDependenciesLambdaIntegration,
                },
                {
                  httpMethod: "PATCH",
                  lambdaIntegration:
                    LambdasManagementIntegrations.Instance
                      .getDependenciesLambdaIntegration,
                },
              ],
            }, // end {dependency_id}
          ],
        },
      ], */
  }; // end dependencies

  return resources;
};
