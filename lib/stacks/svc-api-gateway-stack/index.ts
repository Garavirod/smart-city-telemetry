import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { LambdasManagementIntegrations } from "./cdk/api/lambda-integrations/management/general-lambda-Integration";
import { GeneralApiGateway } from "./cdk/api/general-apigw";
import { SvcApiGatewayInstanceStack } from "./services/lambda-api-integrations/management";



export class SvcApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    SvcApiGatewayInstanceStack.Instance.initConfiguration(this);
    // Lambda integrations
    LambdasManagementIntegrations.Instance.initConfiguration(this);
    // Apigateway 
    GeneralApiGateway.Instance.initConfiguration(this);
  }
}
