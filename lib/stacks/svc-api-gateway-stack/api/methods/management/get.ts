import { GeneralApiGateway } from "../../general-apigw";
import { APIManagementResourcesList } from "../../resources/management/types";

export const createGETHttpMethods = () => {
  GeneralApiGateway.Instance.addHttpMethodToResource({
    httpMethod: "GET",
    resource: APIManagementResourcesList.users,
    lambdaHandler: {
      lambdaNameId: "get-users",
      lambdaFileName: "management/get-users.ts",
      isProxy: true,
    },
  });
  GeneralApiGateway.Instance.addHttpMethodToResource({
    httpMethod: "GET",
    resource: APIManagementResourcesList.dependencies,
    lambdaHandler: {
      lambdaNameId: "get-dependencies",
      lambdaFileName: "management/get-dependencies.ts",
      isProxy: true,
    },
  });
};
