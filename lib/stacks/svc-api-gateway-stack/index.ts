import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { GeneralApiGateway } from "./cdk/api/general-api-gateway";
import { ManagementLambdas } from "./cdk/lambda/management-lambdas";
import { manageMentResources } from "./cdk/api/resources/management/resources";
import { ManagementDynamoDB } from "./cdk/dynamo/management-dynamo";
import { ManagementDynamoKeyName } from "./cdk/dynamo/types";
import { ManagementLambdaKeyNames } from "./cdk/lambda/types";
import { DeployEnvironment } from "./cdk/types";
export class SvcApiGatewayStack extends cdk.Stack {
  public readonly app: cdk.App;
  public readonly appName: string;
  public readonly env: DeployEnvironment;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    const stackName= "SvcApiGateway"
    const name = 'svc-test'
    super(scope, `Dev-${stackName}-stack`, props);
    this.appName = 'Dev-' + name;
    this.node.setContext("appName", this.appName);
    this.node.setContext("env", "Dev");

    // constructs
    const managementLambdas = new ManagementLambdas(this);
    const apiGateway = new GeneralApiGateway(this);
    const managementDynamoDB = new ManagementDynamoDB(this);

    // Api gateway settings
    apiGateway.setLambdaHandlers(managementLambdas.getLambdaHandlers);
    apiGateway.addApiResourceFromRoot({ resources: manageMentResources });

    // DynamoDB settings
    managementDynamoDB.setLambdaHandlers(managementLambdas.getLambdaHandlers);
    managementDynamoDB.grantWritePermissionsToLambdas({
      keyNameTable: ManagementDynamoKeyName.Users,
      keyNameLambdas: [ManagementLambdaKeyNames.GetUsers],
    });
  }
}
