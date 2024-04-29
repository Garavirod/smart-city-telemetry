import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { APiResources } from "./resources/types";
import * as cdk from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class GeneralApiGateway {
  private static _instance: GeneralApiGateway;
  public api: apigateway.RestApi;
  public scope: any;
  public apiResources: Record<APiResources, apigateway.Resource>;
  private constructor() {}

  public initConfiguration(scope: any) {
    this.scope = scope;
    this.apiResources = {
      ...this.apiResources,
    };
    
    this.api = new apigateway.RestApi(scope, "telemetry-api", {
      description: "General API gateway for the dependencies services",
      deployOptions: {
        stageName: "dev",
      },
      // Enable cors:
      defaultCorsPreflightOptions: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
        ],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: ["http://localhost:3000"],
      },
    });
    this.configureAPIKeyPlanUsage();
    // this.configureAPIURL()
  }

  private configureAPIKeyPlanUsage() {
    const apiKey = new apigateway.ApiKey(this.scope, "API-KEY");
    const usagePlan = new apigateway.UsagePlan(this.scope, "Usage Plan", {
      apiStages: [
        {
          api: this.api,
          stage: this.api.deploymentStage,
        },
      ],
    });
    usagePlan.addApiKey(apiKey);
  }

  private configureAPIURL() {
    new cdk.CfnOutput(this.scope, "apiUrl", {
      value: GeneralApiGateway.Instance.api.url,
    });
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public addNewApiResource(nameResource: APiResources) {
    this.apiResources[nameResource] = this.api.root.addResource(nameResource);
    console.log(`El resources ${JSON.stringify(Object.keys(this.apiResources))}`)
  }

  public addResourceToResource(props: {
    parentResource: APiResources;
    childResource: APiResources;
  }) {
    console.log(`Adding resource to ${this.apiResources[props.parentResource]}`)
    this.apiResources[props.childResource] = this.apiResources[props.parentResource].addResource(props.childResource);
  }

  public addHttpMethodToResource(props: {
    httpMethod: httpMethodType;
    resource: APiResources;
    lambdaHandler?: LambdaHandlerParams;
  }) {
    const { httpMethod, resource, lambdaHandler } = props;
    if (!lambdaHandler) {
      this.apiResources[resource].addMethod(httpMethod);
    } else {
      const { requestParameters, requestTemplates, requiredRequestTemplates } =
        this.createRequestAndParamRequests(lambdaHandler.requestParams);

      // Lambda handler
      const handlerIntegration = new NodejsFunction(
        GeneralApiGateway.Instance.scope,
        lambdaHandler.lambdaNameId,
        {
          runtime: lambda.Runtime.NODEJS_18_X,
          handler: lambdaHandler.handler,
          entry: lambdaHandler.entry,
        }
      );

      // Lambda integrations
      const integration = new apigateway.LambdaIntegration(handlerIntegration, {
        proxy: lambdaHandler.isProxy, // More flexibility over event params and body requests,
        requestParameters,
        requestTemplates: {
          "application/json": JSON.stringify(requestTemplates),
        },
      });

      this.apiResources[resource].addMethod(httpMethod, integration, {
        requestParameters: requiredRequestTemplates,
      });
    }
  }

  private createRequestAndParamRequests(
    requestParm: RequestParameters[] | undefined
  ) {
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
  }
}

type LambdaHandlerParams = {
  lambdaNameId: string;
  handler: string;
  entry: any;
  isProxy: boolean;
  requestParams?: RequestParameters[];
  environment?: Record<string, string>;
};

type httpMethodType = "GET" | "POST" | "PATCH" | "DELETE" | "UPDATE";

type requestParamType = "header" | "querystring" | "path";
type RequestParameters = {
  type: requestParamType;
  paramName: string;
  isRequired: boolean;
  sourceParamName: string;
};
