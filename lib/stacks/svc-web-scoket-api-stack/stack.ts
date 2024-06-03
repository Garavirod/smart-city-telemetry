import { Stack, StackProps } from "aws-cdk-lib";
import { WebSocketApi } from "aws-cdk-lib/aws-apigatewayv2";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

type addDynamoTableOptions = {
  tableName: string;
  table: Table;
};

type addLambdaFunctionOptions = {
  lambdaName: string;
  function: NodejsFunction;
};

export class SvcWebSocketApiStack extends Stack {
  private lambdaFunctions: Record<string, NodejsFunction>;
  private dynamoTables: Record<string, Table>;
  private websocket: WebSocketApi | null;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    this.lambdaFunctions = {};
    this.dynamoTables = {};
    this.websocket = null;
  }

  public addLambdaFunction(options: addLambdaFunctionOptions) {
    this.lambdaFunctions[options.lambdaName] = options.function;
  }

  public addDynamoTable(options: addDynamoTableOptions) {
    this.dynamoTables[options.tableName] = options.table;
  }

  public addWebSocketAPI(webSocketApi: WebSocketApi) {
    this.websocket = webSocketApi;
  }

  public get DynamoTables() {
    return this.dynamoTables;
  }

  public get LambdaFunctions() {
    return this.lambdaFunctions;
  }

  public get WebSocketAPI() {
    return this.websocket!;
  }
}
