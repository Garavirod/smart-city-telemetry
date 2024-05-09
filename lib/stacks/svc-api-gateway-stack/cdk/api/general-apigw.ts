import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { randomUUID } from "crypto";
import { APiResourceMethods, ResourcesAPI } from "./resources/types";
import * as cdk from "aws-cdk-lib";
import { manageMentResources } from "./resources/management/resources";

export class GeneralApiGateway {
  private static _instance: GeneralApiGateway;
  public api: apigateway.RestApi;
  public scope: any;
  public apiResources: Record<string, apigateway.Resource>;
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
    // Resources creation
    this.createAPIEndpointResources();
    // Usage plan configuration
    this.configureAPIKeyPlanUsage();
    // Export stack configuration
    this.configureExportStack();
  }

  private createAPIEndpointResources(){
    this.addApiResourceFromRoot(manageMentResources);
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

  private configureExportStack() {
    new cdk.CfnOutput(this.scope, "ApiTelemetryUrl", {
      value: GeneralApiGateway.Instance.api.url,
    });
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  private nestedResources(parent: string, resources: ResourcesAPI[]) {
    for (const r of resources) {
      const resourceId = randomUUID();
      this.apiResources[resourceId] = this.apiResources[parent].addResource(
        r.pathPart
      );
      // add methods
      this.addHttpMethodToResource(r.methods, resourceId);
      // add nested resources
      if (r.resources) {
        for (const re of r.resources) {
          this.nestedResources(resourceId, re.resources ?? []);
        }
      }
    }
  }

  private addApiResourceFromRoot(resources: ResourcesAPI) {
    const resourceId = randomUUID();
    this.apiResources[resources.pathPart] = this.api.root.addResource(
      resources.pathPart
    );
    // Add al methods
    this.addHttpMethodToResource(resources.methods, resourceId);
    // Nested resources
    this.nestedResources(resourceId, resources.resources ?? []);
  }

  private addHttpMethodToResource(
    httpMethods: APiResourceMethods[],
    resourceId: string
  ) {
    for (const method of httpMethods) {
      this.apiResources[resourceId].addMethod(
        method.httpMethod,
        method.lambdaIntegration.functionIntegration,
        {
          requestParameters:
            method.lambdaIntegration.params.requiredRequestTemplates,
        }
      );
    }
  }
}
