import {
  AuthorizationType,
  ResourcesAPI,
} from "../../../../../../../libs/cdk-builders/api-gateway/types";
import { LambdasFunctionNames } from "../../../../../../shared/enums/lambdas";
import { simplePaginationParams } from "../../../../../../shared/utils/simple-paginator-params";
import { SchemasModel } from "../../models/schemas";
import { createResourcesOptions } from "../types";

export const createTrainApiResources = (options: createResourcesOptions) => {
  const resources: ResourcesAPI = {
    pathPart: "trains",
    methods: [
      {
        httpMethod: "GET",
        lambdaFunction: options.lambdaFunctions[LambdasFunctionNames.GetTrains],
        isproxy: true,
        requestParams: simplePaginationParams,
        auth: {
          type: AuthorizationType.Authorization,
          apiAuthorizer: options.cognitoAuthorizer,
        },
      },
      {
        httpMethod: "POST",
        lambdaFunction: options.lambdaFunctions[LambdasFunctionNames.CatchTrainCoords],
        isproxy: true,
        auth:{
          type: AuthorizationType.ApiKeys,
        },
        model:{
          nameId: "TrainCoordsModel",
          schema: SchemasModel.TrainCoordsSchema,
        }
      }
    ],
  }; // end train

  return resources;
};
