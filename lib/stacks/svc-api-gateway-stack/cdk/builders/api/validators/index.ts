import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { ApiRestCDKBuilder } from "../../../../../../libs/cdk-builders/api-gateway";
import {
  ApiRequestValidatorMap,
  RequestValidatorType,
} from "../../../../../../libs/cdk-builders/api-gateway/types";

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
    SimplePaginationValidator: ApiRestCDKBuilder.createRequestValidator({
      restApi: restApi,
      validationType: RequestValidatorType.ParamsType,
      validatorName: "SimplePaginationValidator",
    }),
  };
};

const getApiUsersValidators = (
  restApi: RestApi,
  shared: ApiRequestValidatorMap = {}
) => {
  return {
    ...shared,
    SignUpValidator: ApiRestCDKBuilder.createRequestValidator({
      restApi: restApi,
      validationType: RequestValidatorType.BodyType,
      validatorName: "SignUpValidator",
    }),
    SignInValidator: ApiRestCDKBuilder.createRequestValidator({
      restApi: restApi,
      validationType: RequestValidatorType.BodyType,
      validatorName: "SignInValidator",
    }),
    VerificationCodeValidator: ApiRestCDKBuilder.createRequestValidator({
      restApi: restApi,
      validationType: RequestValidatorType.BodyType,
      validatorName: "VerificationCodeValidator",
    }),
    EmailValidator: ApiRestCDKBuilder.createRequestValidator({
      restApi: restApi,
      validationType: RequestValidatorType.BodyType,
      validatorName: "EmailValidator",
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
  };
};
