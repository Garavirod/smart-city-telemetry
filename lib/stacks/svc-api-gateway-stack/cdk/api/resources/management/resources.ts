import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { ManagementLambdaKeyNames } from "../../../lambda/types";
import { RequestParamType, ResourcesAPI } from "../types";

type createResourcesOptions = {
  lambdaFunctions: Record<string, NodejsFunction>;
};

export const createManagementApiResources = (
  options: createResourcesOptions
) => {
  const resources: ResourcesAPI = {
    pathPart: "management",
    methods: [
      {
        httpMethod: "GET",
        lambdaFunction: options.lambdaFunctions["getUsers"],
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
            lambdaFunction: options.lambdaFunctions["getDependencies"],
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
  return resources;
};
