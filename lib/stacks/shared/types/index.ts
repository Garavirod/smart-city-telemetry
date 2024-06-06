import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export type LambdaFunctions = Record<string, NodejsFunction>;
export type DynamoDBTables = Record<string, Table>;
export type CognitoUserPools = Record<string, UserPool>;
export type CognitoUserPoolClients = Record<string, UserPoolClient>;
