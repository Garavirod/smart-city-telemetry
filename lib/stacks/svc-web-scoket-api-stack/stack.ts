import { Stack, StackProps } from "aws-cdk-lib";
import { WebSocketApi } from "aws-cdk-lib/aws-apigatewayv2";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { WebSocketApiCDKBuilders } from "./cdk";
export class WebSocketApiStack extends Stack {
  private lambdaFunctions: Record<string, NodejsFunction>;
  private dynamoTables: Record<string, Table>;
  private websocket: WebSocketApi;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.createDynamoConstructs();
    this.createLambdaConstructs();
  }

  private createLambdaConstructs() {
    const { lambdaFunctions } = WebSocketApiCDKBuilders.runLambdaBuilder(this);
    this.lambdaFunctions = lambdaFunctions;
  }

  private createDynamoConstructs() {
    const { dynamoTables } = WebSocketApiCDKBuilders.runDynamoBuilder(this);
    this.dynamoTables = dynamoTables;
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

  public getWebSocketAPIEndpoint() {
    return this.websocket.apiEndpoint;
  }

  public getWebSocket(){
    return this.websocket;
  }
}
