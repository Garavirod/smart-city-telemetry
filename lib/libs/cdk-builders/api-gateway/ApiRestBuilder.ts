import { Construct } from "constructs";
import { createResourceNameId } from "../../../stacks/shared/utils/rename-resource-id";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import {
  APiResourceMethods,
  AuthorizationType,
  RequestParameters,
  RequestValidatorType,
  ResourcesAPI,
} from "./types";
import { randomUUID } from "crypto";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Logger } from "../../logger";
import { UserPool } from "aws-cdk-lib/aws-cognito";

type corsOptionsConfig = {
  allowHeaders: string[];
  allowMethods: string[];
  allowCredentials: boolean;
  allowOrigins: string[];
};

type createApiRestOptions = {
  scope: Construct;
  apiRestName: string;
  apiRestDescription: string;
  cors: corsOptionsConfig;
  apiStage: string;
};

type apiKeyUsagePlanOptions = {
  scope: Construct;
  name: string;
  description: string;
  apiRest: RestApi;
};

type setAuthorizerOptions = {
  scope: Construct;
  authorizerName: string;
  userPools: UserPool[];
};

type createRequestValidatorOptions = {
  validatorName: string;
  validationType: RequestValidatorType;
  restApi: RestApi;
};

type ApiResourcesMap = Record<string, apigateway.Resource>;

export function createApiRest(options: createApiRestOptions) {
  const apiRestName = createResourceNameId(options.apiRestName);
  const corsConfig = options.cors;
  // api gateway creation
  return new apigateway.RestApi(options.scope, apiRestName, {
    description: options.apiRestDescription,
    deployOptions: {
      stageName: options.apiStage,
    },
    // Enable cors:
    defaultCorsPreflightOptions: {
      allowHeaders: corsConfig.allowHeaders,
      allowMethods: corsConfig.allowMethods,
      allowCredentials: corsConfig.allowCredentials,
      allowOrigins: corsConfig.allowOrigins,
    },
  });
}

export function createCognitoAuthorizer(options: setAuthorizerOptions) {
  return new apigateway.CognitoUserPoolsAuthorizer(
    options.scope,
    createResourceNameId(options.authorizerName),
    {
      cognitoUserPools: options.userPools,
    }
  );
}

export function configureAPIKeyPlanUsage(options: apiKeyUsagePlanOptions) {
  const apiKeName = createResourceNameId(options.name);
  const usagePlanName = options.description;
  const apiKey = new apigateway.ApiKey(options.scope, apiKeName, {
    apiKeyName: apiKeName,
  });
  const usagePlan = new apigateway.UsagePlan(options.scope, usagePlanName, {
    apiStages: [
      {
        api: options.apiRest,
        stage: options.apiRest.deploymentStage,
      },
    ],
  });
  usagePlan.addApiKey(apiKey);
}

/**
 * Add a nested resources, from a parent resource to
 * an specific resource child
 * @param props
 */
function addHttpMethodToResource(props: {
  resourceId: string;
  httpMethods: APiResourceMethods[];
  restApi: RestApi;
  scope: Construct;
  apiResourcesMap: ApiResourcesMap;
}) {
  for (const method of props.httpMethods) {
    // Build request parameters
    const params = createRequestAndParamRequests(method.requestParams);
    // Create lambda integration
    const integration = createLambdaIntegration({
      isProxy: method.isproxy,
      requestParameters: params.requestParameters,
      lambdaFunction: method.lambdaFunction,
      requestTemplates: params.requestTemplates,
    });
    const authorizationProps = getAuthorizerProps(method);
    const apiModel = method.model
      ? { "application/json": method.model }
      : void 0;
    // Create methods with integration
    props.apiResourcesMap[props.resourceId].addMethod(
      method.httpMethod,
      integration,
      {
        apiKeyRequired: getApiKeyRequired(method),
        // Marked request parameters as required
        requestParameters: params.requiredRequestTemplates,
        requestModels: apiModel,
        // Validate params or body
        requestValidator: method.validator,
        // Cognito authorizer
        authorizer: authorizationProps.authorizer,
        authorizationType: authorizationProps.authorizationType,
      }
    );
  }

  // add cors options
  //addCorsOptions(props.apiResourcesMap[props.resourceId]);
}

function addCorsOptions(apiResource: apigateway.IResource) {
  /* 
  In API Gateway, you need to handle these OPTIONS requests by providing a response that tells the browser 
  which HTTP methods and headers are allowed for the resource This is typically done using a mock integration.
  */
  apiResource.addMethod(
    "OPTIONS",
    new apigateway.MockIntegration({
      // These responses are from the backend (like a Lambda function) to API Gateway. They map the backend responses to API Gateway responses.
      /* integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Origin": "'*'",
            "method.response.header.Access-Control-Allow-Headers":
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
            "method.response.header.Access-Control-Allow-Credentials":
              "'false'",
            "method.response.header.Access-Control-Allow-Methods":
              "'OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD'",
          },
        },
      ], */
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        "application/json": '{"statusCode": 200}',
      },
    }),
    {
      // These responses are from API Gateway to the client. They ensure the response format and headers are as expected for the client.
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Origin": true,
            "method.response.header.Access-Control-Allow-Headers": true,
            "method.response.header.Access-Control-Allow-Credentials": true,
            "method.response.header.Access-Control-Allow-Methods": true,
          },
        },
      ],
    }
  );
}

export function createApiModel(options: {
  restApi: RestApi;
  scope: Construct;
  schema: any;
  modelNameId: string;
}) {
  const model = new apigateway.Model(
    options.scope,
    createResourceNameId(options.modelNameId),
    {
      restApi: options.restApi,
      contentType: "application/json",
      schema: options.schema,
    }
  );
  return model;
}

function getAuthorizerProps(method: APiResourceMethods) {
  if (method.auth.type === AuthorizationType.Authorization) {
    return {
      authorizer: method.auth.apiAuthorizer!,
      authorizationType: apigateway.AuthorizationType.COGNITO,
    };
  }

  return {
    authorizer: undefined,
    authorizationType: undefined,
  };
}

function getApiKeyRequired(method: APiResourceMethods) {
  return method.auth.type === AuthorizationType.ApiKeys
    ? method.auth.apiKeyRequired
    : void 0;
}

export function createRequestValidator(options: createRequestValidatorOptions) {
  let requestValidators = {
    validateRequestBody: false,
    validateRequestParameters: false,
  };

  if (options.validationType === RequestValidatorType.BodyAndParamsType) {
    // Validate params and body
    requestValidators.validateRequestBody = true;
    requestValidators.validateRequestParameters = true;
  } else if (options.validationType === RequestValidatorType.BodyType) {
    // validate body only
    requestValidators.validateRequestBody = true;
  } else {
    //validate params only
    requestValidators.validateRequestParameters = true;
  }

  return options.restApi.addRequestValidator(
    createResourceNameId(options.validatorName),
    requestValidators
  );
}

/**
 * Returns an object with the requestParameters, requestTemplates
 * and the required requestTemplates given the requestParameters.
 * @param requestParm
 * @returns Object
 */
function createRequestAndParamRequests(
  requestParm: RequestParameters[] | undefined
) {
  let requestParameters: Record<string, string> = {};
  let requestTemplates: Record<string, string> = {};
  let requiredRequestTemplates: Record<string, boolean> = {};

  if (requestParm) {
    for (const item of requestParm) {
      // Map requestParameters to the integration
      requestParameters[
        `integration.request.${item.type}.${item.paramName}`
      ] = `method.request.${item.type}.${item.sourceParamName}`;

      // Build payload for requestParameters defined in requestParameters
      requestTemplates[
        `${item.paramName}`
      ] = `$input.params('${item.paramName}')`;

      // Marked request parameters for http method creation
      requiredRequestTemplates[
        `method.request.${item.type}.${item.paramName}`
      ] = item.isRequired;
    }
  }
  return { requestParameters, requestTemplates, requiredRequestTemplates };
}

/**
 * Nests resources to a child resource
 * @param props
 */
function nestedResources(props: {
  parent: string;
  resources: ResourcesAPI[];
  restApi: RestApi;
  scope: Construct;
  apiResourcesMap: ApiResourcesMap;
}) {
  for (const r of props.resources) {
    const resourceId = randomUUID();
    props.apiResourcesMap[resourceId] = props.apiResourcesMap[
      props.parent
    ].addResource(r.pathPart);
    // add methods
    addHttpMethodToResource({
      httpMethods: r.methods,
      resourceId: resourceId,
      restApi: props.restApi,
      scope: props.scope,
      apiResourcesMap: props.apiResourcesMap,
    });
    // add nested resources
    if (r.resources) {
      nestedResources({
        parent: resourceId,
        resources: r.resources ?? [],
        restApi: props.restApi,
        scope: props.scope,
        apiResourcesMap: props.apiResourcesMap,
      });
    }
  }
}

/**
 * Create a resource endpoint from the root of the api
 * @param props
 */
export function addApiResourceFromRoot(props: {
  resources: ResourcesAPI;
  restApi: RestApi;
  scope: Construct;
}) {
  const resourceId = randomUUID();
  const apiResourcesMap: ApiResourcesMap = {};
  apiResourcesMap[resourceId] = props.restApi.root.addResource(
    props.resources.pathPart
  );
  // Add al methods
  addHttpMethodToResource({
    resourceId: resourceId,
    httpMethods: props.resources.methods,
    restApi: props.restApi,
    scope: props.scope,
    apiResourcesMap,
  });
  // Nested resources
  nestedResources({
    parent: resourceId,
    resources: props.resources.resources ?? [],
    restApi: props.restApi,
    scope: props.scope,
    apiResourcesMap,
  });
}

/**
 * Create an instance of LambdaIntegration
 * @param props
 * @returns {LambdaIntegration}
 */
function createLambdaIntegration(props: {
  lambdaFunction: NodejsFunction;
  isProxy: boolean;
  requestParameters: Record<string, string>;
  requestTemplates: Record<string, string>;
}) {
  return new apigateway.LambdaIntegration(props.lambdaFunction, {
    proxy: props.isProxy, // More flexibility over event params and body requests,
    requestParameters: props.requestParameters, // Define mapping parameters from your method to your integration
    requestTemplates: {
      // Define a mapping that will build a payload for your integration, based
      // on the integration parameters that you have specified
      "application/json": JSON.stringify(props.requestTemplates),
    },
  });
}
