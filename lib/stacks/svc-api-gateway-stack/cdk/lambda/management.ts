import { Table } from "aws-cdk-lib/aws-dynamodb";
import { appStackScopes } from "../stacks";
import { LambdaBuilder } from "./LambdaBuilder";

type lambdaConstructOptions = {
  builder: LambdaBuilder;
  dynamoTables: Record<string, Table>;
};

export const buildLambdaConstructs = (options: lambdaConstructOptions) => {
  options.builder.createNodeFunctionLambda({
    lambdaName: "getUsers",
    fileNameImlCode: "get-users.ts",
    environment: {
      USERS_TABLE: `${options.dynamoTables["Users"].tableName}`,
    },
  });

  options.builder.createNodeFunctionLambda({
    lambdaName: "getDependencies",
    fileNameImlCode: "get-dependencies.ts",
    environment: {},
  });
};
