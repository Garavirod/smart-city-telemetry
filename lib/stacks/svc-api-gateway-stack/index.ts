import { Construct } from "constructs";
import * as cdk from 'aws-cdk-lib';
import { createAPIGatewayServices } from "./api";

export class SvcApiGatewayStack extends cdk.Stack{
  constructor(scope: Construct, id: string, props?: cdk.StackProps){
    super(scope, id, props);
    // Apigateway services
    createAPIGatewayServices(this);
    // Lambda services
    
    // S3 Services

    // DynamoDB Services

  }
}
