import { Stack, StackProps } from "aws-cdk-lib";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { ApiGatewayCDKBuilders } from "./cdk";

export class ApiGatewayStack extends Stack {
  public lambdaFunctions: Record<string, NodejsFunction>;
  public dynamoTables: Record<string, Table>;
  public cognitoUserPools: Record<string, UserPool>;
  public cognitoUserPoolClients: Record<string, UserPoolClient>;
  public restApi: RestApi;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.createDynamoConstructs();
    this.createCognitoConstructs();
    this.createLambdaConstructs();
    this.createApiRestConstructs();
  }

  private createLambdaConstructs() {
    const { lambdaFunctions } = ApiGatewayCDKBuilders.runLambdaBuilder(this);
    this.lambdaFunctions = lambdaFunctions;
  }

  private createCognitoConstructs() {
    const { cognitoUserPoolClients, cognitoUserPools } =
      ApiGatewayCDKBuilders.runCognitoBuilder(this);

    this.cognitoUserPools = cognitoUserPools;
    this.cognitoUserPoolClients = cognitoUserPoolClients;
  }

  private createDynamoConstructs() {
    const { dynamoTables } = ApiGatewayCDKBuilders.runDynamoBuilder(this);
    this.dynamoTables = dynamoTables;
  }

  private createApiRestConstructs() {
    const { restApi } = ApiGatewayCDKBuilders.runApiRestBuilder(this);
    this.restApi = restApi;
  }
}
