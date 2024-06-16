import {
  AuthorizationType,
  ResourcesAPI,
} from "../../../../../../../libs/cdk-builders/api-gateway/types";
import { LambdasFunctionNames } from "../../../../../../shared/enums/lambdas";
import { simplePaginationParams } from "../../../../../../shared/utils/simple-paginator-params";
import { createResourcesOptions } from "../types";
import { ModelNames } from "../../models/enum";
import { ValidatorNames } from "../../validators/enums";

export const createUsersApiResources = (options: createResourcesOptions) => {
  const resources: ResourcesAPI = {
    pathPart: "users",
    methods: [
      {
        httpMethod: "GET",
        lambdaFunction: options.lambdaFunctions[LambdasFunctionNames.GetUsers],
        isproxy: true,
        requestParams: simplePaginationParams,
        validator: options.validators[ValidatorNames.SimplePaginationValidator],
        auth: {
          type: AuthorizationType.Authorization,
          apiAuthorizer: options.cognitoAuthorizer,
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
            validator: options.validators[ValidatorNames.SignInValidator],
            model: options.apiModels![ModelNames.SignInModel],
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
            validator: options.validators[ValidatorNames.SignUpUserValidator],
            model: options.apiModels![ModelNames.SignUpModel],
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
              options.lambdaFunctions[LambdasFunctionNames.VerificationCode],
            isproxy: true,
            validator:
              options.validators[ValidatorNames.VerificationCodeValidator],
            model: options.apiModels![ModelNames.VerificationCodeModel],
            auth: {
              type: AuthorizationType.None,
            },
          },
        ],
      }, //end verification code
      {
        pathPart: "resend",
        methods: [
          {
            httpMethod: "POST",
            lambdaFunction:
              options.lambdaFunctions[LambdasFunctionNames.ResendCode],
            isproxy: true,
            validator: options.validators[ValidatorNames.EmailValidator],
            model: options.apiModels![ModelNames.EmailModel],
            auth: {
              type: AuthorizationType.None,
            },
          },
        ],
      }, // end resend
      {
        pathPart: "signout",
        methods: [],
        resources: [
          {
            pathPart: "{userId}",
            methods: [
              {
                httpMethod: "POST",
                lambdaFunction:
                  options.lambdaFunctions[LambdasFunctionNames.SignOut],
                isproxy: true,
                validator:
                  options.validators[ValidatorNames.SignOutUserValidator],
                auth: {
                  type: AuthorizationType.Authorization,
                  apiAuthorizer: options.cognitoAuthorizer,
                },
                model: options.apiModels![ModelNames.SignOutModel],
              },
            ],
          },
        ],
      },
    ],
  }; // end users

  return resources;
};
