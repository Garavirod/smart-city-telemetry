import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { createLambdaIntegration, createRequestAndParamRequests } from "../utils";
import {
  LambdaIntegrationDefinition,
  RequestParamType,
  RequestParameters,
} from "../../resources/types";

export class LambdasManagementIntegrations {
  private static _instance: LambdasManagementIntegrations;
  private scope: any;

  // Lambda
  public getUsersLambdaIntegration: LambdaIntegrationDefinition;
  public getDependenciesLambdaIntegration: LambdaIntegrationDefinition;

  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public initConfiguration(scope: any) {
    this.scope = scope;
    this.createLambdaIntegrations();
  }

  /**
   * This method create all teh lambda handler defined individually
   */
  private createLambdaIntegrations() {
    this.createLambdaGetUsers();
    this.createLambdaGetDependencies();
  }

  /**
   * Creates the lambda integrations Get Users
   */
  private createLambdaGetUsers() {
    // Setting the requestParameters up
    const lambdaRequestParams: RequestParameters[] = [
      {
        type: RequestParamType.QueryString,
        isRequired: true,
        sourceParamName: "page_size",
        paramName: "page_size",
      },
      {
        type: RequestParamType.QueryString,
        isRequired: true,
        sourceParamName: "page_size",
        paramName: "page_size",
      },
    ];
    this.getUsersLambdaIntegration.params =
      createRequestAndParamRequests(lambdaRequestParams);

    // Create lambda integration
    this.getUsersLambdaIntegration.functionIntegration =
      createLambdaIntegration({
        scope:this.scope,
        httpMethod: "GET",
        lambdaNameId: "get-users",
        lambdaFileName: "management/get-users.ts",
        isProxy: true,
        requestParameters:
          this.getUsersLambdaIntegration.params.requestParameters,
        requestTemplates:
          this.getUsersLambdaIntegration.params.requestTemplates,
      });
  }

  private createLambdaGetDependencies(){

  }
}
