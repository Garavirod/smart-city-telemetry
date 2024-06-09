import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Table } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Topic } from "aws-cdk-lib/aws-sns";

export type LambdaFunctions = Record<string, NodejsFunction>;
export type DynamoDBTables = Record<string, Table>;
export type CognitoUserPools = Record<string, UserPool>;
export type CognitoUserPoolClients = Record<string, UserPoolClient>;
export type SnsTopics = Record<string, Topic>;
