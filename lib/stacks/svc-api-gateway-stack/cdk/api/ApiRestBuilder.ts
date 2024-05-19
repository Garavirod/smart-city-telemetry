import { Construct } from "constructs";
import { createResourceNameId } from "../helpers";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { CfnOutput } from "aws-cdk-lib";
import {
  APiResourceMethods,
  RequestParameters,
  ResourcesAPI,
} from "./resources/types";
import { randomUUID } from "crypto";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

type corsOptionsConfig = {
  allowHeaders: string[];
  allowMethods: string[];
  allowCredentials: boolean;
  allowOrigins: string[];
};

type createApiRestOptions = {
  apiRestName: string;
  apiRestDescription: string;
  cors: corsOptionsConfig;
  apiStage: string;
};

type apiKeyUsagePlanOptions = {
  name: string;
  description: string;
};
export class ApiRestBuilder {
  private scope: Construct;
  private apiResourcesMap: Record<string, apigateway.Resource>;
  private apiRestName: string;
  private apiRestDescription: string;
  private corsConfig: corsOptionsConfig;
  public apiRest: RestApi;

  constructor(scope: Construct) {
    this.scope = scope;
  }

  public createApiRest(options: createApiRestOptions) {
    this.apiRestName = createResourceNameId(options.apiRestName);
    this.apiRestDescription;
    this.corsConfig = options.cors;
    this.apiResourcesMap = { ...this.apiResourcesMap };
    // api gateway creation
    this.apiRest = new apigateway.RestApi(this.scope, this.apiRestName, {
      description: this.apiRestDescription,
      deployOptions: {
        stageName: options.apiStage,
      },
      // Enable cors:
      defaultCorsPreflightOptions: {
        allowHeaders: this.corsConfig.allowHeaders,
        allowMethods: this.corsConfig.allowMethods,
        allowCredentials: this.corsConfig.allowCredentials,
        allowOrigins: this.corsConfig.allowOrigins,
      },
    });
  }

  public get getApiRest() {
    return this.apiRest;
  }

  public setCorsConfiguration(cors: corsOptionsConfig) {
    this.corsConfig = cors;
  }

  public configureExportStack(exportName: string) {
    const nameStackExportationUrl = exportName;
    new CfnOutput(this.scope, nameStackExportationUrl, {
      value: this.apiRest.url,
    });
  }

  public configureAPIKeyPlanUsage(options: apiKeyUsagePlanOptions) {
    const apiKeName = createResourceNameId(options.name);
    const usagePlanName = options.description;
    const apiKey = new apigateway.ApiKey(this.scope, apiKeName, {
      apiKeyName: apiKeName,
    });
    const usagePlan = new apigateway.UsagePlan(this.scope, usagePlanName, {
      apiStages: [
        {
          api: this.apiRest,
          stage: this.apiRest.deploymentStage,
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
        lambdaFunction: method.lambdaFunction,
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
   * Create a resource endpoint from the root of the api
   * @param props
   */
  public addApiResourceFromRoot(props: { resources: ResourcesAPI }) {
    const resourceId = randomUUID();
    this.apiResourcesMap[resourceId] = this.apiRest.root.addResource(
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
}