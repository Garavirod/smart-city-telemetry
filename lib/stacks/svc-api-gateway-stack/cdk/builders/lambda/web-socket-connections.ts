import { Stack } from "aws-cdk-lib";
import { LambdaCDKBuilder } from "../../../../../libs/cdk-builders/lambda";
import { DynamoTableNames } from "../../../../shared/enums/dynamodb";
import { LambdasFunctionNames } from "../../../../shared/enums/lambdas";
import { DynamoDBTables } from "../../../../shared/types";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export const createWebSocketConnLambdas = (
  stack: Stack,
  tables: DynamoDBTables
) => {
  const codeFilepathBase =
    "/svc-api-gateway-stack/handlers/websocket-connections";

  // LAMBDAS
  const lambdaFunctions: Record<string, NodejsFunction> = {
    [LambdasFunctionNames.CreateNewConnection]:
      LambdaCDKBuilder.createNodeFunctionLambda({
        scope: stack,
        lambdaName: LambdasFunctionNames.CreateNewConnection,
        pathStackHandlerCode: `${codeFilepathBase}/create-new-connection.ts`,
        environment: {
          CONNECTIONS_TABLE:
            tables[DynamoTableNames.TableNames.Connections].tableName,
        },
      }),
    [LambdasFunctionNames.DeleteConnection]:
      LambdaCDKBuilder.createNodeFunctionLambda({
        scope: stack,
        lambdaName: LambdasFunctionNames.DeleteConnection,
        pathStackHandlerCode: `${codeFilepathBase}/delete-connection.ts`,
        environment: {
          CONNECTIONS_TABLE:
            tables[DynamoTableNames.TableNames.Connections].tableName,
        },
      }),
  };

  // DYNAMO PERMISSIONS
  LambdaCDKBuilder.grantWritePermissionsToDynamo({
    dynamoTable: tables[DynamoTableNames.TableNames.Connections],
    lambdas: [
      lambdaFunctions[LambdasFunctionNames.CreateNewConnection],
      lambdaFunctions[LambdasFunctionNames.DeleteConnection],
    ],
  });
  return lambdaFunctions;
};
