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
      handler: "get-users.handler",
      entry: path.join(__dirname, "../../../lambdas/lambda-code"),
      isProxy: true,
    },
  });
  GeneralApiGateway.Instance.addHttpMethodToResource({
    httpMethod: "GET",
    resource: APIManagementResourcesList.dependencies,
    lambdaHandler: {
      lambdaNameId: "get-dependencies",
      handler: "get-dependencies.handler",
      entry: path.join(__dirname, "../../../lambdas/lambda-code"),
      isProxy: true,
    },
  });
};
