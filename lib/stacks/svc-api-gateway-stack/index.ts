import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { GeneralApiGateway } from "./api/general-apigw";
import { createAllAPIResources } from "./api/resources";
import { LambdasManagementIntegrations } from "./api/lambda-integrations/management/general-lambda-Integration";

export class SvcApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // Lambda integrations
    LambdasManagementIntegrations.Instance.initConfiguration(this);

    // Apigateway services
    GeneralApiGateway.Instance.initConfiguration(this);
    createAllAPIResources();
  }
}
