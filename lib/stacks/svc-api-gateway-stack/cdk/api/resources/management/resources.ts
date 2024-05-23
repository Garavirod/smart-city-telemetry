import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { RequestParamType, ResourcesAPI } from "../types";
import { LambdasFunctionNames } from "../../../lambda/types";
import { SchemaModelBuilder } from "../../models/helpers/generate-schemas-model";
import { Validators } from "../../validators";
import { simplePaginationParams } from "../../../helpers/paginator";

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
        lambdaFunction: options.lambdaFunctions[LambdasFunctionNames.GetUsers],
        isproxy: true,
        requestParams: {
          validatorNameId: Validators.GenericValidatorNames.SimplePaginationValidator,
          params: simplePaginationParams,
        },
      },
      {
        httpMethod: "POST",
        model: {
          validatorNameId: Validators.ManagementValidatorNames.SignupUserValidator,
          schema: SchemaModelBuilder.management({
            interfaceName: "SignupUsersModel",
          }),
        },
        lambdaFunction:
          options.lambdaFunctions[LambdasFunctionNames.RegisterNewUser],
        isproxy: true,
      },
    ],
    resources: [
      {
        pathPart: "dependencies",
        methods: [
          {
            httpMethod: "GET",
            lambdaFunction:
              options.lambdaFunctions[LambdasFunctionNames.GetDependencies],
            isproxy: true,
            requestParams: {
              validatorNameId: Validators.GenericValidatorNames.SimplePaginationValidator,
              params: simplePaginationParams
            }
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
