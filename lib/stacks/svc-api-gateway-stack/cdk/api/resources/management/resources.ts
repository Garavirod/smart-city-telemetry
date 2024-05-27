import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import {
  AuthorizationType,
  ResourcesAPI,
} from "../../../../../../libs/cdk-builders/api-gateway/types";
import { LambdasFunctionNames } from "../../../../../shared/enums/lambdas";
import { SchemaModelBuilder } from "../../../../../shared/utils/generate-api-schemas-model";
import { simplePaginationParams } from "../../../../../shared/utils/simple-paginator-params";
import { ApiAuthorizersNames } from "../../../../../shared/enums/api-authorizers";
import { ValidatorNames } from "../../../../../shared/enums/api-validators";

type createResourcesOptions = {
  lambdaFunctions: Record<string, NodejsFunction>;
};

export const createManagementApiResources = (
  options: createResourcesOptions
) => {
  const resources: ResourcesAPI = {
    pathPart: "management",
    methods: [], // end management methods
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
              validatorNameId: ValidatorNames.SimplePaginationValidator,
              params: simplePaginationParams,
            },
            auth: {
              type: AuthorizationType.Authorization,
              apiAuthorizerName: ApiAuthorizersNames.AdminAuthorizer,
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
      }, // end dependencies
      {
        pathPart: "users",
        methods: [
          {
            httpMethod: "GET",
            lambdaFunction:
              options.lambdaFunctions[LambdasFunctionNames.GetUsers],
            isproxy: true,
            requestParams: {
              validatorNameId: ValidatorNames.SimplePaginationValidator,
              params: simplePaginationParams,
            },
            auth: {
              type: AuthorizationType.Authorization,
              apiAuthorizerName: ApiAuthorizersNames.AdminAuthorizer,
            },
          },
        ], // end users methods
        resources: [
          {
            pathPart: "signin",
            methods: [
              {
                httpMethod: "POST",
                lambdaFunction:
                  options.lambdaFunctions[LambdasFunctionNames.SignIn],
                isproxy: true,
                model: {
                  validatorNameId: ValidatorNames.SignInValidator,
                  schema: SchemaModelBuilder.management({
                    interfaceName: "SignInUserModel",
                  }),
                },
                auth: {
                  type: AuthorizationType.None,
                },
              },
            ],
          },
          {
            pathPart: "signup",
            methods: [
              {
                httpMethod: "POST",
                lambdaFunction:
                  options.lambdaFunctions[LambdasFunctionNames.SignUp],
                isproxy: true,
                model: {
                  validatorNameId: ValidatorNames.SignupUserValidator,
                  schema: SchemaModelBuilder.management({
                    interfaceName: "SignupUsersModel",
                  }),
                },
                auth: {
                  type: AuthorizationType.None,
                },
              },
            ],
          },
          {
            pathPart: "verification",
            methods: [
              {
                httpMethod: "POST",
                lambdaFunction:
                  options.lambdaFunctions[
                    LambdasFunctionNames.VerificationCode
                  ],
                isproxy: true,
                model: {
                  validatorNameId: ValidatorNames.VerificationCodeValidator,
                  schema: SchemaModelBuilder.management({
                    interfaceName: "VerificationCodeModel",
                  }),
                },
                auth: {
                  type: AuthorizationType.None,
                },
              },
            ],
          },
        ],
      }, // end users
    ],
  };
  return resources;
};
