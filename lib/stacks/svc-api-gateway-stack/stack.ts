import { Stack, StackProps } from "aws-cdk-lib";
import { RestApi } from "aws-cdk-lib/aws-apigateway";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { ApiGatewayCDKBuilders } from "./cdk";
import { WebSocketApiStack } from "../svc-web-scoket-api-stack/stack";

export class ApiGatewayStack extends Stack {
  private lambdaFunctions: Record<string, NodejsFunction>;
  private dynamoTables: Record<string, Table>;
  private cognitoUserPools: Record<string, UserPool>;
  private cognitoUserPoolClients: Record<string, UserPoolClient>;
  private restApi: RestApi;

  constructor(scope: Construct, id: string, webSocketApiStack:WebSocketApiStack, props?: StackProps) {
    super(scope, id, props);
    this.createDynamoConstructs();
    this.createCognitoConstructs();
    this.createLambdaConstructs(webSocketApiStack);
    this.createApiRestConstructs();
  }

  private createLambdaConstructs(webSocketApiStack:WebSocketApiStack) {
    const { lambdaFunctions } = ApiGatewayCDKBuilders.runLambdaBuilder(this, webSocketApiStack);
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

  public getTable(tableName: string) {
    return this.dynamoTables[tableName];
  }

  public getTableId(tableName: string) {
    return this.dynamoTables[tableName].tableName;
  }

  public getLambda(nameId: string) {
    return this.lambdaFunctions[nameId];
  }

  public getLambdaFunctions() {
    return this.lambdaFunctions;
  }

  public getCognitoUserClient(clientName: string) {
    return this.cognitoUserPoolClients[clientName];
  }

  public getCognitoUserClientId(clientName: string) {
    return this.cognitoUserPoolClients[clientName].userPoolClientId;
  }

  public getCognitoUserPool(poolId: string) {
    return this.cognitoUserPools[poolId];
  }

  public getRestApi() {
    return this.restApi;
  }
}
