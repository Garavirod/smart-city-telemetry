import { Construct } from "constructs";
import { GeneralApiGateway } from "./general-apigw";
import { createAllAPIResources } from "./resources";
import * as cdk from 'aws-cdk-lib';

export class APIGatewayStack extends cdk.Stack{
  constructor(scope: Construct, id: string, props?: cdk.StackProps){
    super(scope, id, props);
    GeneralApiGateway.Instance.initConfiguration(this);
    createAllAPIResources();
  }
}
