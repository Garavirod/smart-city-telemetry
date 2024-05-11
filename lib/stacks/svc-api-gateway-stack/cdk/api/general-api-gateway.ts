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
    this.apiName = 'telemetry-api"';
    this.apiDescription = "General API gateway for the dependencies services";
    this.stage = "dev";
    this.corsConfig = this.buildCorsConfigurations();
    this.apiResourcesMap = {...this.apiResourcesMap};
    this.apiGateway = new apigateway.RestApi(this.scope, this.apiName, {
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

    this.configureAPIKeyPlanUsage();
    this.configureExportStack();
  }

  public setLambdaHandlers(
    lambdaFunctions: Record<LambdasKeyNames, NodejsFunction>
  ) {
    this.lambdaFunctions = { ...this.lambdaFunctions, ...lambdaFunctions };
  }

  public addApiResourceFromRoot(props: { resources: ResourcesAPI }) {
    const resourceId = randomUUID();
    this.apiResourcesMap[props.resources.pathPart] =
      this.apiGateway.root.addResource(props.resources.pathPart);
    // Add al methods
    this.addHttpMethodToResource({
      resourceId: resourceId,
      httpMethods: props.resources.methods,
    });
    console.debug("Methods added for ", props.resources.pathPart);
    // Nested resources
    this.nestedResources({
      parent: resourceId,
      resources: props.resources.resources ?? [],
    });
  }

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
        requestParameters: props.requestParameters,
        requestTemplates: {
          "application/json": JSON.stringify(props.requestTemplates),
        },
      }
    );
  }

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

  private configureAPIKeyPlanUsage() {
    const apiKeName = "svc-api-gateway-key";
    const usagePlanName = "Usage plan for svc-api-gateway";
    const apiKey = new apigateway.ApiKey(this.scope, apiKeName);
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

  private configureExportStack() {
    const nameStackExportationUrl = "ApiGatewayTelemetryUrl";
    new cdk.CfnOutput(this.scope, nameStackExportationUrl, {
      value: this.apiGateway.url,
    });
  }

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
