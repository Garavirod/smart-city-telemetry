import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { LambdasManagementIntegrations } from "./cdk/api/lambda-integrations/management/general-lambda-Integration";
import { GeneralApiGateway } from "./cdk/api/general-apigw";
import { createAllAPIResources } from "./cdk/api/resources";


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
