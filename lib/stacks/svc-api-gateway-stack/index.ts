import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { createAPIGatewayServices } from "./api";
import { GeneralApiGateway } from "./api/general-apigw";
import { createAllAPIResources } from "./api/resources";

export class SvcApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // Apigateway services
    GeneralApiGateway.Instance.initConfiguration(this);
    createAllAPIResources();
  }
}
