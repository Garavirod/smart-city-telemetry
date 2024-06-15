import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { ApiRestCDKBuilder } from "../../../../../../libs/cdk-builders/api-gateway";
import {
  ApiModelMap,
} from "../../../../../../libs/cdk-builders/api-gateway/types";
import { ModelNames } from "./enum";
import { Stack } from "aws-cdk-lib";
import { generateSchemaModel } from "../../../../../shared/utils/generate-api-schemas-model";

type optionsModel = {
  restApi: RestApi;
  scope: Stack;
};

export const getModels = (options: optionsModel) => {
  const sharedModels = getSharedModels(options);

  return {
    apiUsersModels: getApiUsersModels(
      options.restApi,
      options.scope,
      sharedModels
    ),
    apiDependenciesModels: getApiDependenciesModel(
      options.restApi,
      options.scope,
      sharedModels
    ),
    apiTrainsModels: getTrainsModel(
      options.restApi,
      options.scope,
      sharedModels
    ),
  };
};

const getSharedModels = (options: optionsModel) => {
  return {
    [ModelNames.SignOutModel]: ApiRestCDKBuilder.createApiModel({
      restApi: options.restApi,
      modelNameId: ModelNames.SignOutModel,
      scope: options.scope,
      schema: generateSchemaModel({
        modelsFileName: "users.ts",
        interfaceName: "AccessTokenModel",
      }),
    }),
  };
};

const getApiUsersModels = (
  restApi: RestApi,
  scope: Stack,
  shared: ApiModelMap = {}
) => {
  const modelFileNameSource = "users.ts";
  return {
    ...shared,
    [ModelNames.SignUpModel]: ApiRestCDKBuilder.createApiModel({
      restApi: restApi,
      modelNameId: ModelNames.SignUpModel,
      scope: scope,
      schema: generateSchemaModel({
        modelsFileName: modelFileNameSource,
        interfaceName: "SignupUsersModel",
      }),
    }),
    [ModelNames.SignInModel]: ApiRestCDKBuilder.createApiModel({
      restApi: restApi,
      modelNameId: ModelNames.SignInModel,
      scope: scope,
      schema: generateSchemaModel({
        modelsFileName: modelFileNameSource,
        interfaceName: "SignInUserModel",
      }),
    }),
    [ModelNames.VerificationCodeModel]: ApiRestCDKBuilder.createApiModel({
      restApi: restApi,
      modelNameId: ModelNames.VerificationCodeModel,
      scope: scope,
      schema: generateSchemaModel({
        modelsFileName: modelFileNameSource,
        interfaceName: "VerificationCodeModel",
      }),
    }),
    [ModelNames.EmailModel]: ApiRestCDKBuilder.createApiModel({
      restApi: restApi,
      modelNameId: ModelNames.EmailModel,
      scope: scope,
      schema: generateSchemaModel({
        modelsFileName: modelFileNameSource,
        interfaceName: "EmailModel",
      }),
    }),
  };
};

const getApiDependenciesModel = (
  restApi: RestApi,
  scope: Stack,
  shared: ApiModelMap = {}
) => {
  return {
    ...shared,
  };
};

const getTrainsModel = (
  restApi: RestApi,
  scope: Stack,
  shared: ApiModelMap = {}
) => {
  const modelFileNameSource = "trains.ts";
  return {
    ...shared,
    [ModelNames.TrainLocationModel]: ApiRestCDKBuilder.createApiModel({
      restApi: restApi,
      modelNameId: ModelNames.TrainLocationModel,
      scope: scope,
      schema: generateSchemaModel({
        modelsFileName: modelFileNameSource,
        interfaceName: "TrainCoordsModel",
      }),
    }),
  };
};
