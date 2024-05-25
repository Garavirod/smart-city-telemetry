import { UserPool } from "aws-cdk-lib/aws-cognito";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export type ResourcesAPI = {
  pathPart: string;
  methods: APiResourceMethods[];
  resources?: ResourcesAPI[];
};

export enum AuthorizationType {
  "ApiKeys" = "ApiKeys",
  "Authorization" = "Authorization",
  "None"="None"
}

export type APiResourceMethods = {
  httpMethod: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  lambdaFunction: NodejsFunction;
  isproxy: boolean;
  requestParams?: {
    validatorNameId: string;
    params: RequestParameters[];
  };
  model?: {
    validatorNameId: string;
    schema: any;
  };
  auth: {
    type: AuthorizationType;
    apiKeyRequired?:boolean;
    apiAuthorizerName?:string;
  };
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
