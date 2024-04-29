import { GeneralApiGateway } from "../../general-apigw";
import { APIManagementResourcesList } from "../../resources/management/types";
import path = require("path");

export const createGETHttpMethods = () => {
  const API_INTEGRATIONS_BASE_PATH =
    "../../../lambda-api-integrations/management";

  GeneralApiGateway.Instance.addHttpMethodToResource({
    httpMethod: "GET",
    resource: APIManagementResourcesList.users,
    lambdaHandler: {
      lambdaNameId: "get-users",
      handler: "handler",
      entry: path.join(__dirname, `${API_INTEGRATIONS_BASE_PATH}/get-users.ts`),
      isProxy: true,
    },
  });
  GeneralApiGateway.Instance.addHttpMethodToResource({
    httpMethod: "GET",
    resource: APIManagementResourcesList.dependencies,
    lambdaHandler: {
      lambdaNameId: "get-dependencies",
      handler: "handler",
      entry: path.join(
        __dirname,
        `${API_INTEGRATIONS_BASE_PATH}/get-dependencies.ts`
      ),
      isProxy: true,
    },
  });
};
