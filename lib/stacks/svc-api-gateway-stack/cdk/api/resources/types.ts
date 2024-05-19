import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export type ResourcesAPI = {
  pathPart: string;
  methods: APiResourceMethods[];
  resources?: ResourcesAPI[];
};
export type APiResourceMethods = {
  httpMethod: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  lambdaFunction: NodejsFunction;
  isproxy: boolean;
  requestParams: RequestParameters[];
};

export enum RequestParamType {
  "Header" = "header",
  "QueryString" = "querystring",
  "Path" = "path",
}
export type RequestParameters = {
  type: RequestParamType;
  paramName: string;
  isRequired: boolean;
  sourceParamName: string;
};
