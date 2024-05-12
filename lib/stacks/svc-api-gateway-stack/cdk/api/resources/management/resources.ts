import { ManagementLambdaKeyNames } from "../../../lambda/types";
import { RequestParamType, ResourcesAPI } from "../types";

export const manageMentResources: ResourcesAPI = {
  pathPart: "management",
  methods: [
    {
      httpMethod: "GET",
      lambdaKeyName: ManagementLambdaKeyNames.GetUsers,
      isproxy: true,
      requestParams: [
        {
          isRequired: true,
          sourceParamName: "pageSize",
          paramName: "pageSize",
          type: RequestParamType.QueryString,
        },
      ],
    },
    /* {
      httpMethod: "POST",
      lambdaIntegration:
        LambdasManagementIntegrations.Instance.getUsersLambdaIntegration,
    }, */
  ],
  resources: [
    {
      pathPart: "dependencies",
      methods: [
        {
          httpMethod: "GET",
          lambdaKeyName: ManagementLambdaKeyNames.GetDependencies,
          isproxy: true,
          requestParams: [
            {
              isRequired: true,
              sourceParamName: "pageSize",
              paramName: "pageSize",
              type: RequestParamType.QueryString,
            },
          ],
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
    }, // end map-api-keys
    /* {
      pathPart: "users",
      methods: [
        {
          httpMethod: "GET",
          lambdaIntegration:
            LambdasManagementIntegrations.Instance
              .getDependenciesLambdaIntegration,
        },
      ],
    }, // end users */
  ],
};
