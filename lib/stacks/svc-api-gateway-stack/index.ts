import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import { GeneralApiGateway } from "./cdk/api/general-api-gateway";
import { ManagementLambdas } from "./cdk/lambda/management-lambdas";
import { manageMentResources } from "./cdk/api/resources/management/resources";
import { ManagementDynamoDB } from "./cdk/dynamo/management-dynamo";
import { ManagementDynamoKeyName } from "./cdk/dynamo/types";
import { ManagementLambdaKeyNames } from "./cdk/lambda/types";

export class SvcApiGatewayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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
