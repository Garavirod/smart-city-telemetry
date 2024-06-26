import { Stack } from "aws-cdk-lib";
import { LambdaCDKBuilder } from "../../../../../libs/cdk-builders/lambda";
import { LambdasFunctionNames } from "../../../../shared/enums/lambdas";
import { DynamoDBTables } from "../../../../shared/types";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export const createDependenciesLambdas = (stack: Stack, tables:DynamoDBTables) => {
  const codeFilepathBase = "/svc-api-gateway-stack/handlers/dependencies";

  // LAMBDAS
  const lambdaFunctions: Record<string, NodejsFunction> = {
    [LambdasFunctionNames.GetDependencies]:
      LambdaCDKBuilder.createNodeFunctionLambda({
        scope: stack,
        lambdaName: LambdasFunctionNames.GetDependencies,
        pathStackHandlerCode: `${codeFilepathBase}/get-dependencies.ts`,
        environment: {},
      }),
  };
  return lambdaFunctions;
};
