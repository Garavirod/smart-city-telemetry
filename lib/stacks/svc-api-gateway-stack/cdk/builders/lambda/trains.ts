import { Stack } from "aws-cdk-lib";
import { LambdaCDKBuilder } from "../../../../../libs/cdk-builders/lambda";
import { DynamoTableNames } from "../../../../shared/enums/dynamodb";
import { LambdasFunctionNames } from "../../../../shared/enums/lambdas";
import { DynamoDBTables, SnsTopics } from "../../../../shared/types";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { SnsTopicNames } from "../../../../shared/enums/sns";
import { WebSocketApi } from "aws-cdk-lib/aws-apigatewayv2";
import { GlobalEnvironmentVars } from "../../../../../libs/environment";

type createTrainLambdasOptions = {
  stack: Stack;
  tables: DynamoDBTables;
  topics: SnsTopics;
  webSocket: WebSocketApi;
};
export const createTrainsLambdas = (options: createTrainLambdasOptions) => {
  const { stack, tables, topics, webSocket } = options;
  const codeFilepathBase = "/svc-api-gateway-stack/handlers/trains";

  // LAMBDAS
  const lambdaFunctions: Record<string, NodejsFunction> = {
    [LambdasFunctionNames.NotifyTrainLocation]:
      LambdaCDKBuilder.createNodeFunctionLambda({
        scope: stack,
        lambdaName: LambdasFunctionNames.NotifyTrainLocation,
        pathStackHandlerCode: `${codeFilepathBase}/notify-train-location.ts`,
        environment: {
          CONNECTIONS_TABLE:
            tables[DynamoTableNames.TableNames.Connections].tableName,
          WEBSOCKET_API_ENDPOINT: `https://${webSocket.apiId}.execute-api.us-east-1.amazonaws.com/${GlobalEnvironmentVars.DEPLOY_ENVIRONMENT}`,
        },
      }),
    [LambdasFunctionNames.CatchTrainCoords]:
      LambdaCDKBuilder.createNodeFunctionLambda({
        scope: stack,
        lambdaName: LambdasFunctionNames.CatchTrainCoords,
        pathStackHandlerCode: `${codeFilepathBase}/catch-train-coords.ts`,
        environment: {
          TRAINS_TABLE: tables[DynamoTableNames.TableNames.Trains].tableName,
          NOTIFY_TRAIN_LOCATION_TOPIC_ARN:
            topics[SnsTopicNames.NotifyTrainLocationTopic].topicArn,
        },
      }),
    [LambdasFunctionNames.GetTrains]: LambdaCDKBuilder.createNodeFunctionLambda(
      {
        scope: stack,
        lambdaName: LambdasFunctionNames.GetTrains,
        pathStackHandlerCode: `${codeFilepathBase}/get-trains.ts`,
        environment: {
          TRAINS_TABLE: tables[DynamoTableNames.TableNames.Trains].tableName,
        },
      }
    ),
  };

  // DYNAMO PERMISSIONS
  LambdaCDKBuilder.grantReadPermissionsToDynamo({
    dynamoTable: tables[DynamoTableNames.TableNames.Connections],
    lambdas: [lambdaFunctions[LambdasFunctionNames.NotifyTrainLocation]],
  });

  LambdaCDKBuilder.grantReadPermissionsToDynamo({
    dynamoTable: tables[DynamoTableNames.TableNames.Trains],
    lambdas: [lambdaFunctions[LambdasFunctionNames.GetTrains]],
  });

  LambdaCDKBuilder.grantWritePermissionsToDynamo({
    dynamoTable: tables[DynamoTableNames.TableNames.Trains],
    lambdas: [lambdaFunctions[LambdasFunctionNames.CatchTrainCoords]],
  });

  // WEBSOCKET API PERMISSIONS
  LambdaCDKBuilder.grantPermissionToInvokeAPI({
    webSocket,
    lambdaFunctions: [
      lambdaFunctions[LambdasFunctionNames.NotifyTrainLocation],
    ],
  });

  // SNS PERMISSIONS
  LambdaCDKBuilder.grantTopicPublishPermissions({
    lambdas: [lambdaFunctions[LambdasFunctionNames.CatchTrainCoords]],
    topic: topics[SnsTopicNames.NotifyTrainLocationTopic],
  });
  LambdaCDKBuilder.addSnsEventSource({
    lambda: lambdaFunctions[LambdasFunctionNames.NotifyTrainLocation],
    topic: topics[SnsTopicNames.NotifyTrainLocationTopic],
  });
  return lambdaFunctions;
};
