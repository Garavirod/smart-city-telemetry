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
      handler: "handler",
      entry: path.join(__dirname, "../../../lambdas/management/get-users.ts"),
      isProxy: true,
    },
  });
  GeneralApiGateway.Instance.addHttpMethodToResource({
    httpMethod: "GET",
    resource: APIManagementResourcesList.dependencies,
    lambdaHandler: {
      lambdaNameId: "get-dependencies",
      handler: "handler",
      entry: path.join(__dirname, "../../../lambdas/management/get-dependencies.ts"),
      isProxy: true,
    },
  });
};
