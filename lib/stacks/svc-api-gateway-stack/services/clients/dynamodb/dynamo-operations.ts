import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

import { GetOptions, PutOptions } from "./types";
import { DynamoClientInstance } from "./dynamo-client";

export const PutCommandOperation = async (options: PutOptions) => {
  const client = new DynamoClientInstance();
  const command = new PutCommand({
    TableName: options.TableName,
    Item: options.Item,
  });
  const response = await client.getDynamoDBClient.send(command);
  client.destroyDynamoClients();
  return response;
};

export const QueryCommandOperation = async (options: PutOptions) => {
  const client = new DynamoClientInstance();
  const command = new PutCommand({
    TableName: options.TableName,
    Item: options.Item,
  });
  const response = await client.getDynamoDBClient.send(command);
  client.destroyDynamoClients();
  return response;
};

export const GetCommandOperation = async (options: GetOptions) => {
  const client = new DynamoClientInstance();
  const command = new GetCommand({
    TableName: options.TableName,
    Key: options.key,
  });
  const response = await client.getDynamoDBClient.send(command);
  client.destroyDynamoClients();
  return response;
};
