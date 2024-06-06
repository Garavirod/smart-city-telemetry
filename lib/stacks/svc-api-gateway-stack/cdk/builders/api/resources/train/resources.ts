import {
  AuthorizationType,
  ResourcesAPI,
} from "../../../../../../../libs/cdk-builders/api-gateway/types";
import { ApiAuthorizersNames } from "../../../../../../shared/enums/api-authorizers";
import { ValidatorNames } from "../../../../../../shared/enums/api-validators";
import { LambdasFunctionNames } from "../../../../../../shared/enums/lambdas";
import { simplePaginationParams } from "../../../../../../shared/utils/simple-paginator-params";
import { createResourcesOptions } from "../types";

export const createTrainApiResources = (options: createResourcesOptions) => {
  const resources: ResourcesAPI = {
    pathPart: "trains",
    methods: [
      {
        httpMethod: "GET",
        lambdaFunction: options.lambdaFunctions[LambdasFunctionNames.GetTrains],
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
  }; // end train

  return resources;
};
