import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { APIGatewayStack } from './stacks/api/stack';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SmartCityTelemetryStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // API Gateway stack 
    new APIGatewayStack(this).createStack();
  
    // example resource
    // const queue = new sqs.Queue(this, 'SmartCityTelemetryQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
