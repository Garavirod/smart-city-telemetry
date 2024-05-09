import { SvcApiGatewayInstanceStack } from "../../../../services/lambda-api-integrations/management";
import {
  LambdaIntegrationDefinition,
  RequestParamType,
  RequestParameters,
} from "../../resources/types";
import {
  createLambdaIntegration,
  createRequestAndParamRequests,
} from "../utils";

const lambdaRequestParams: RequestParameters[] = [
  {
    type: RequestParamType.QueryString,
    isRequired: true,
    sourceParamName: "page_size",
    paramName: "page_size",
  },
  {
    type: RequestParamType.QueryString,
    isRequired: true,
    sourceParamName: "page_size",
    paramName: "page_size",
  },
];

const params = createRequestAndParamRequests(lambdaRequestParams);

export const getUsersLambdaIntegration: LambdaIntegrationDefinition = {
  params: createRequestAndParamRequests(lambdaRequestParams),
  functionIntegration: createLambdaIntegration({
    scope: SvcApiGatewayInstanceStack.Instance.scope,
    httpMethod: "GET",
    lambdaNameId: "get-users",
    lambdaFileName: "management/get-users.ts",
    isProxy: true,
    requestParameters: params.requestParameters,
    requestTemplates: params.requestTemplates,
  }),
};
