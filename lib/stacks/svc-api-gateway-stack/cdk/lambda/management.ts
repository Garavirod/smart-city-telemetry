import { Table } from "aws-cdk-lib/aws-dynamodb";
import { LambdaBuilder } from "./LambdaBuilder";
import { DynamoTableNames } from "../dynamo/types";
import { LambdasFunctionNames } from "./types";

type lambdaConstructOptions = {
  builder: LambdaBuilder;
  dynamoTables: Record<DynamoTableNames, Table>;
};

export const buildLambdaConstructs = (options: lambdaConstructOptions) => {
  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.GetUsers,
    fileNameImlCode: "get-users.ts",
    environment: {
      USERS_TABLE: `${options.dynamoTables[DynamoTableNames.Users].tableName}`,
    },
  });

  options.builder.createNodeFunctionLambda({
    lambdaName: LambdasFunctionNames.GetDependencies,
    fileNameImlCode: "get-dependencies.ts",
    environment: {},
  });
};
