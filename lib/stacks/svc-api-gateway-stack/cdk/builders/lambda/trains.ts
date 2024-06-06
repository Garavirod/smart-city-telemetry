import { LambdaCDKBuilder } from "../../../../../libs/cdk-builders/lambda";
import { DynamoTableNames } from "../../../../shared/enums/dynamodb";
import { LambdasFunctionNames } from "../../../../shared/enums/lambdas";
import { DynamoDBTables } from "../../../../shared/types";
import { ApiGatewayStack } from "../../../stack";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export const createTrainsLambdas = (
  stack: ApiGatewayStack,
  tables: DynamoDBTables
) => {
  const codeFilepathBase = "/svc-api-gateway-stack/handlers/trains";

  // LAMBDAS
  const lambdaFunctions: Record<string, NodejsFunction> = {
    [LambdasFunctionNames.NotifyTrainLocation]:
      LambdaCDKBuilder.createNodeFunctionLambda({
        scope: stack,
        lambdaName: LambdasFunctionNames.NotifyTrainLocation,
        pathStackHandlerCode: `${codeFilepathBase}/notify-train-location.ts`,
        environment: {
          TRAINS_TABLE: tables[DynamoTableNames.TableNames.Trains].tableName,
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
  LambdaCDKBuilder.grantWritePermissionsToDynamo({
    dynamoTable: tables[DynamoTableNames.TableNames.Connections],
    lambdas: [
      lambdaFunctions[LambdasFunctionNames.SignIn],
      lambdaFunctions[LambdasFunctionNames.NotifyTrainLocation],
    ],
  });

  LambdaCDKBuilder.grantReadPermissionsToDynamo({
    dynamoTable: tables[DynamoTableNames.TableNames.Trains],
    lambdas: [lambdaFunctions[LambdasFunctionNames.GetTrains]],
  });
  return lambdaFunctions;
};
