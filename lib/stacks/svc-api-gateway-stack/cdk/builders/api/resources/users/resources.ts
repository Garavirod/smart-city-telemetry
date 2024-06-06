import {
  AuthorizationType,
  ResourcesAPI,
} from "../../../../../../../libs/cdk-builders/api-gateway/types";
import { LambdasFunctionNames } from "../../../../../../shared/enums/lambdas";
import { simplePaginationParams } from "../../../../../../shared/utils/simple-paginator-params";
import { ValidatorNames } from "../../../../../../shared/enums/api-validators";
import { createResourcesOptions } from "../types";
import { SchemasModel } from "../../models/schemas";

export const createUsersApiResources = (options: createResourcesOptions) => {
  const resources: ResourcesAPI = {
    pathPart: "users",
    methods: [
      {
        httpMethod: "GET",
        lambdaFunction: options.lambdaFunctions[LambdasFunctionNames.GetUsers],
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
              validator: {
                nameId: "SignInValidator",
                validator: options.validators["SignInValidator"],
              },
              schema: SchemasModel.signInSchema,
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
              validator: {
                nameId: "SignupUserValidator",
                validator: options.validators["SignupUserValidator"],
              },
              schema: SchemasModel.signUpSchema,
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
              options.lambdaFunctions[LambdasFunctionNames.VerificationCode],
            isproxy: true,
            model: {
              validator: {
                nameId: "VerificationCodeValidator",
                validator: options.validators["VerificationCodeValidator"],
              },
              schema: SchemasModel.verificationCodeSchema,
            },
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
            model: {
              validator: {
                nameId: "EmailValidator",
                validator: options.validators["EmailValidator"],
              },
              schema: SchemasModel.EmailSchema,
            },
            auth: {
              type: AuthorizationType.None,
            },
          },
        ],
      }, // end resend
    ],
  }; // end users

  return resources;
};
