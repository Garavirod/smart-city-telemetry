import {
  CognitoUserPoolsAuthorizer,
  IRequestValidator,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export type ResourcesAPI = {
  pathPart: string;
  methods: APiResourceMethods[];
  resources?: ResourcesAPI[];
};

export enum AuthorizationType {
  "ApiKeys" = "ApiKeys",
  "Authorization" = "Authorization",
  "None" = "None",
}

export type ApiRequestValidatorMap = Record<string, IRequestValidator>;

export type APiResourceMethods = {
  httpMethod: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  lambdaFunction: NodejsFunction;
  isproxy: boolean;
  requestParams?: {
    validatorNameId: string;
    params: RequestParameters[];
  };
  model?: {
    validator: {nameId:string, validator:IRequestValidator};
    schema: any;
  };
  auth: {
    type: AuthorizationType;
    apiKeyRequired?: boolean;
    apiAuthorizer?: CognitoUserPoolsAuthorizer;
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

export enum RequestValidatorType {
  "BodyType" = "BodyType",
  "ParamsType" = "ParamsType",
  "BodyAndParamsType" = "BodyAndParamsType",
}
