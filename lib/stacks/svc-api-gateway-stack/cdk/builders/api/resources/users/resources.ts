import {
  AuthorizationType,
  ResourcesAPI,
} from "../../../../../../../libs/cdk-builders/api-gateway/types";
import { LambdasFunctionNames } from "../../../../../../shared/enums/lambdas";
import { simplePaginationParams } from "../../../../../../shared/utils/simple-paginator-params";
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
        requestParams: simplePaginationParams,
        validator: options.validators["SimplePaginationValidator"],
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
            validator: options.validators["SignInValidator"],
            model: {
              nameId: "SignInModel",
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
            validator: options.validators["SignUpValidator"],
            model: {
              nameId: "SignUpValidator",
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
            validator: options.validators["VerificationCodeValidator"],
            model: {
              nameId: "VerificationCodeModel",
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
            validator: options.validators["EmailValidator"],
            model: {
              nameId: "EmailModel",
              schema: SchemasModel.EmailSchema,
            },
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
                auth: {
                  type: AuthorizationType.Authorization,
                  apiAuthorizer: options.cognitoAuthorizer,
                },
                model:{
                  nameId: "AccessTokenModel",
                  schema: SchemasModel.AccessTokenSchema,
                }
              },
            ],
          },
        ],
      },
    ],
  }; // end users

  return resources;
};
