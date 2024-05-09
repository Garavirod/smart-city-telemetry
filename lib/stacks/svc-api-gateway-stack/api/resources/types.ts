import * as apigateway from "aws-cdk-lib/aws-apigateway";

export type ResourcesAPI = {
  pathPart: string;
  methods: APiResourceMethods[];
  resources?: ResourcesAPI[];
};
export type APiResourceMethods = {
  httpMethod: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  lambdaIntegration: LambdaIntegrationDefinition;
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

export type LambdaHandlerParams = {
  scope:any,
  lambdaNameId: string;
  lambdaFileName: any;
  isProxy: boolean;
  requestParameters: Record<string, string>;
  requestTemplates: Record<string, string>;
  environment?: Record<string, string>;
  httpMethod: string;
};

export type LambdaIntegrationDefinition = {
  params: {
    requestParameters: Record<string, string>;
    requestTemplates: Record<string, string>;
    requiredRequestTemplates: Record<string, boolean>;
  };
  functionIntegration: apigateway.LambdaIntegration;
};
