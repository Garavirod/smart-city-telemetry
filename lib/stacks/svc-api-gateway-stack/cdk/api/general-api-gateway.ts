import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { randomUUID } from "crypto";
import {
  APiResourceMethods,
  RequestParameters,
  ResourcesAPI,
} from "./resources/types";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdasKeyNames } from "../lambda/types";
import { getEnvironmentNameResource } from "../helpers/override-logical-resource-name";

export class GeneralApiGateway {
  private scope: Construct;
  private apiName: string;
  private apiDescription: string;
  private stage: string;
  private corsConfig: any;
  private apiGateway: apigateway.RestApi;
  private apiResourcesMap: Record<string, apigateway.Resource>;
  private lambdaFunctions: Record<LambdasKeyNames, NodejsFunction>;

  constructor(scope: Construct) {
    this.scope = scope;
    this.apiName = "TelemetryApi";
    this.apiDescription = "General API gateway for the dependencies services";
    this.stage = "dev";
    this.corsConfig = this.buildCorsConfigurations();
    this.apiResourcesMap = { ...this.apiResourcesMap };
    this.lambdaFunctions = { ...this.lambdaFunctions };
    this.apiGateway = new apigateway.RestApi(this.scope, this.apiName, {
      restApiName: this.apiName,
      description: this.apiDescription,
      deployOptions: {
        stageName: this.stage,
      },
      // Enable cors:
      defaultCorsPreflightOptions: {
        allowHeaders: this.corsConfig.allowHeaders,
        allowMethods: this.corsConfig.allowMethods,
        allowCredentials: this.corsConfig.allowCredentials,
        allowOrigins: this.corsConfig.allowOrigins,
      },
    });
    // Configure usage plan
    this.configureAPIKeyPlanUsage();
    // Configure stack output
    this.configureExportStack();
  }

  /**
   * Set the lambdas for using them inside class
   * @param lambdaFunctions
   */
  public setLambdaHandlers(
    lambdaFunctions: Record<LambdasKeyNames, NodejsFunction>
  ) {
    this.lambdaFunctions = { ...this.lambdaFunctions, ...lambdaFunctions };
  }

  /**
   * Create a resource endpoint from the root of the api
   * @param props
   */
  public addApiResourceFromRoot(props: { resources: ResourcesAPI }) {
    const resourceId = randomUUID();
    this.apiResourcesMap[resourceId] = this.apiGateway.root.addResource(
      props.resources.pathPart
    );
    // Add al methods
    this.addHttpMethodToResource({
      resourceId: resourceId,
      httpMethods: props.resources.methods,
    });
    // Nested resources
    this.nestedResources({
      parent: resourceId,
      resources: props.resources.resources ?? [],
    });
  }

  /**
   * Create an instance of LambdaIntegration
   * @param props
   * @returns {LambdaIntegration}
   */
  private createLambdaIntegration(props: {
    lambdaKeyName: LambdasKeyNames;
    isProxy: boolean;
    requestParameters: Record<string, string>;
    requestTemplates: Record<string, string>;
  }) {
    return new apigateway.LambdaIntegration(
      this.lambdaFunctions[props.lambdaKeyName],
      {
        proxy: props.isProxy, // More flexibility over event params and body requests,
        requestParameters: props.requestParameters, // Define mapping parameters from your method to your integration
        requestTemplates: {
          // Define a mapping that will build a payload for your integration, based
          // on the integration parameters that you have specified
          "application/json": JSON.stringify(props.requestTemplates),
        },
      }
    );
  }

  /**
   * Add a nested resources, from a parent resource to
   * an specific resource child
   * @param props
   */
  private addHttpMethodToResource(props: {
    resourceId: string;
    httpMethods: APiResourceMethods[];
  }) {
    for (const method of props.httpMethods) {
      // Build request parameters
      const params = this.createRequestAndParamRequests(method.requestParams);
      // Create lambda integration
      const integration = this.createLambdaIntegration({
        isProxy: method.isproxy,
        requestParameters: params.requestParameters,
        lambdaKeyName: method.lambdaKeyName,
        requestTemplates: params.requestTemplates,
      });
      // Create methods with integration
      this.apiResourcesMap[props.resourceId].addMethod(
        method.httpMethod,
        integration,
        {
          apiKeyRequired: true,
          // Marked request parameters as required
          requestParameters: params.requiredRequestTemplates,
        }
      );
    }
  }

  /**
   * Returns an object with the requestParameters, requestTemplates
   * and the required requestTemplates given the requestParameters.
   * @param requestParm
   * @returns Object
   */
  private createRequestAndParamRequests(
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
  private nestedResources(props: {
    parent: string;
    resources: ResourcesAPI[];
  }) {
    for (const r of props.resources) {
      const resourceId = randomUUID();
      this.apiResourcesMap[resourceId] = this.apiResourcesMap[
        props.parent
      ].addResource(r.pathPart);
      // add methods
      this.addHttpMethodToResource({
        httpMethods: r.methods,
        resourceId: resourceId,
      });
      // add nested resources
      if (r.resources) {
        for (const re of r.resources) {
          this.nestedResources({
            parent: resourceId,
            resources: re.resources ?? [],
          });
        }
      }
    }
  }

  /**
   * Create the API keys usage plan
   */
  private configureAPIKeyPlanUsage() {
    const apiKeName = getEnvironmentNameResource("ApiGatewayKey");
    const usagePlanName = "Usage plan for svc-api-gateway";
    const apiKey = new apigateway.ApiKey(this.scope, apiKeName, {
      apiKeyName: apiKeName,
    });
    const usagePlan = new apigateway.UsagePlan(this.scope, usagePlanName, {
      apiStages: [
        {
          api: this.apiGateway,
          stage: this.apiGateway.deploymentStage,
        },
      ],
    });
    usagePlan.addApiKey(apiKey);
  }

  /**
   * Configure the cdk exportation (visibility for other stacks)
   */
  private configureExportStack() {
    const nameStackExportationUrl = "ApiGatewayTelemetryUrl";
    new cdk.CfnOutput(this.scope, nameStackExportationUrl, {
      value: this.apiGateway.url,
    });
  }

  /**
   * Define CORS configuration for the API
   * @returns {Object}
   */
  private buildCorsConfigurations() {
    const allowHeaders = [
      "Content-Type",
      "X-Amz-Date",
      "Authorization",
      "X-Api-Key",
    ];

    const allowMethods = ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"];

    const allowCredentials = true;

    const allowOrigins = ["http://localhost:3000"];

    return {
      allowHeaders,
      allowMethods,
      allowCredentials,
      allowOrigins,
    };
  }
}
