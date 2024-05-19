import { Table } from "aws-cdk-lib/aws-dynamodb";
import { LambdaBuilder } from "../../../../libs/cdk-builders/LambdaBuilder";
import { DynamoTableNames } from "../dynamo/types";
import { LambdasFunctionNames } from "./types";

type lambdaConstructOptions = {
  builder: LambdaBuilder;
  dynamoTables: Record<DynamoTableNames, Table>;
};

export const buildLambdaConstructs = (options: lambdaConstructOptions) => {

  const codeFilepathBase = "/svc-api-gateway-stack/services/handlers/management";

  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.GetUsers,
    pathStackHandlerCode: `${codeFilepathBase}/get-users.ts`,
    environment: {
      USERS_TABLE: `${options.dynamoTables[DynamoTableNames.Users].tableName}`,
    },
  });

  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.GetDependencies,
    pathStackHandlerCode: `${codeFilepathBase}/get-dependencies.ts`,
    environment: {},
  });
};
