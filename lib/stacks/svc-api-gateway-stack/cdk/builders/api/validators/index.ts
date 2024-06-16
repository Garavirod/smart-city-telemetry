import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { ApiRestCDKBuilder } from "../../../../../../libs/cdk-builders/api-gateway";
import {
  ApiRequestValidatorMap,
  RequestValidatorType,
} from "../../../../../../libs/cdk-builders/api-gateway/types";
import { ValidatorNames } from "./enums";

export const getValidators = (restApi: RestApi) => {
  const sharedValidators = getSharedValidators(restApi);

  return {
    apiUsersValidators: getApiUsersValidators(restApi, sharedValidators),
    apiDependenciesValidators: getApiDependenciesValidators(
      restApi,
      sharedValidators
    ),
    apiTrainsValidators: getTrainsValidators(restApi, sharedValidators),
  };
};

const getSharedValidators = (restApi: RestApi) => {
  return {
    [ValidatorNames.SimplePaginationValidator]:
      ApiRestCDKBuilder.createRequestValidator({
        restApi: restApi,
        validationType: RequestValidatorType.ParamsType,
        validatorName: ValidatorNames.SimplePaginationValidator,
      }),
  };
};

const getApiUsersValidators = (
  restApi: RestApi,
  shared: ApiRequestValidatorMap = {}
) => {
  return {
    ...shared,
    [ValidatorNames.SignUpUserValidator]:
      ApiRestCDKBuilder.createRequestValidator({
        restApi: restApi,
        validationType: RequestValidatorType.BodyType,
        validatorName: ValidatorNames.SignUpUserValidator,
      }),
    [ValidatorNames.SignInValidator]: ApiRestCDKBuilder.createRequestValidator({
      restApi: restApi,
      validationType: RequestValidatorType.BodyType,
      validatorName: ValidatorNames.SignInValidator,
    }),
    [ValidatorNames.VerificationCodeValidator]:
      ApiRestCDKBuilder.createRequestValidator({
        restApi: restApi,
        validationType: RequestValidatorType.BodyType,
        validatorName: ValidatorNames.VerificationCodeValidator,
      }),
    [ValidatorNames.EmailValidator]: ApiRestCDKBuilder.createRequestValidator({
      restApi: restApi,
      validationType: RequestValidatorType.BodyType,
      validatorName: ValidatorNames.EmailValidator,
    }),
    [ValidatorNames.SignOutUserValidator]: ApiRestCDKBuilder.createRequestValidator({
      restApi: restApi,
      validationType: RequestValidatorType.BodyType,
      validatorName: ValidatorNames.SignOutUserValidator,
    }),
  };
};

const getApiDependenciesValidators = (
  restApi: RestApi,
  shared: ApiRequestValidatorMap = {}
) => {
  return {
    ...shared,
  };
};

const getTrainsValidators = (
  restApi: RestApi,
  shared: ApiRequestValidatorMap = {}
) => {
  return {
    ...shared,
    [ValidatorNames.TrainCoordsValidator]:
      ApiRestCDKBuilder.createRequestValidator({
        restApi: restApi,
        validationType: RequestValidatorType.BodyType,
        validatorName: ValidatorNames.TrainCoordsValidator,
      }),
  };
};
