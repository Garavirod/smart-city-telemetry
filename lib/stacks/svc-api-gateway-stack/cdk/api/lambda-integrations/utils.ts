import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaHandlerParams, RequestParameters } from "../resources/types";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import path = require("path");

export const createLambdaIntegration = (props: LambdaHandlerParams) => {
  const nodeFunctionConfig = new NodejsFunction(
    props.scope,
    props.httpMethod,
    {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: path.join(
        __dirname,
        `../../../services/lambda-api-integrations/${props.lambdaFileName}`
      ),
      environment: {},
    }
  );

  const lambdaIntegration = new LambdaIntegration(nodeFunctionConfig, {
    proxy: props.isProxy, // More flexibility over event params and body requests,
    requestParameters: props.requestParameters,
    requestTemplates: {
      "application/json": JSON.stringify(props.requestTemplates),
    },
  });

  return lambdaIntegration;
};

  /**
   * Returns an object with the requestParameters, requestTemplates and the required requestTemplates
   * given the requestParameters.
   * @param requestParm
   * @returns Object
   */
  export const createRequestAndParamRequests = (
    requestParm: RequestParameters[] | undefined
  ) => {
    let requestParameters: Record<string, string> = {};
    let requestTemplates: Record<string, string> = {};
    let requiredRequestTemplates: Record<string, boolean> = {};

    if (requestParm) {
      for (const item of requestParm) {
        requestParameters[
          `integration.request.${item.type}.${item.paramName}`
        ] = `method.request.${item.type}.${item.sourceParamName}`;
        requestTemplates[
          `${item.paramName}`
        ] = `$input.params('${item.paramName}')`;
        requiredRequestTemplates[`${item.paramName}`] = item.isRequired;
      }
    }
    return { requestParameters, requestTemplates, requiredRequestTemplates };
  };
