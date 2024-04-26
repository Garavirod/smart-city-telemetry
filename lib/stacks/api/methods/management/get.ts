import { Code } from "aws-cdk-lib/aws-lambda";
import { GeneralApiGateway } from "../../general-apigw";
import { APIManagementResourcesList } from "../../resources/management/types";
import path = require("path");

export const createGETHttpMethods = () => {
  GeneralApiGateway.Instance.addHttpMethodToResource({
    httpMethod: "GET",
    resource: APIManagementResourcesList.users,
    lambdaHandler: {
      lambdaNameId: "get-users",
      handler: "",
      code: Code.fromAsset(path.join(__dirname, "../../../lambdas/management/get-users")),
      isProxy: true,
    },
  });
  GeneralApiGateway.Instance.addHttpMethodToResource({
    httpMethod: "GET",
    resource: APIManagementResourcesList.dependencies,
    lambdaHandler: {
      lambdaNameId: "get-dependencies",
      handler: "",
      code: Code.fromAsset(path.join(__dirname, "../../../lambdas/management/get-dependencies")),
      isProxy: true,
    },
  });
};
