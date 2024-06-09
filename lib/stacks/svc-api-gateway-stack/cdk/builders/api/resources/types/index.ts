import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { ApiRequestValidatorMap } from "../../../../../../../libs/cdk-builders/api-gateway/types";
import { CognitoUserPoolsAuthorizer } from "aws-cdk-lib/aws-apigateway";

export type createResourcesOptions = {
  lambdaFunctions: Record<string, NodejsFunction>;
  validators: ApiRequestValidatorMap;
  cognitoAuthorizer: CognitoUserPoolsAuthorizer;
};
