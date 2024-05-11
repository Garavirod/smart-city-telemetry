import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { GeneralApiGateway } from "./cdk/api/general-api-gateway";
import { ManagementLambdas } from "./cdk/lambda/management-lambdas";
import { manageMentResources } from "./cdk/api/resources/management/resources";

export class SvcApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda constructs
    const managementLambdas = new ManagementLambdas(this);
    // Api gateway constructs
    const apiGateway = new GeneralApiGateway(this);

    apiGateway.setLambdaHandlers(managementLambdas.getLambdaHandlers);
    apiGateway.addApiResourceFromRoot({ resources: manageMentResources });
  }
}
