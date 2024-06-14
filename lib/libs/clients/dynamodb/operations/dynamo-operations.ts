import {
  DeleteCommandInput,
  DynamoDBDocumentPaginationConfiguration,
  GetCommand,
  GetCommandInput,
  PutCommand,
  QueryCommandInput,
  paginateQuery,
} from "@aws-sdk/lib-dynamodb";

import {
  DeleteOptions,
  GetOptions,
  PutOptions,
  QueryPaginateResult,
  QueryPaginationOptions,
  UpdateOptions,
} from "./types";
import { DynamoClientInstance } from "../client/dynamo-client";

import {
  getUpdateExpressions,
  toExpressionAttributeNames,
  toExpressionAttributeValues,
  toFilterExpressions,
  toKeyConditionExpressions,
  toKeyConditionExpressionsBeginWith,
} from "./helpers";
import { Logger } from "../../../logger";
import {
  DeleteItemCommand,
  UpdateItemCommand,
  UpdateItemInput,
} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

export const PutCommandOperation = async (options: PutOptions) => {
  Logger.debug(`PutCommand options >: ${JSON.stringify(options)}`);
  const client = new DynamoClientInstance();
  const command = new PutCommand({
    TableName: options.TableName,
    Item: options.Item,
  });
  await client.getDynamoDBDocumentClient.send(command);
  client.destroyDynamoClients();
  Logger.debug("PutCommand successfully done!");
};

export const GetCommandOperation = async <T>(options: GetOptions) => {
  const client = new DynamoClientInstance();
  const input: GetCommandInput = {
    TableName: options.TableName,
    Key: options.key,
  };
  Logger.debug(`GetCommand Input >: ${JSON.stringify(input)}`);
  const command = new GetCommand(input);
  const response = await client.getDynamoDBDocumentClient.send(command);
  client.destroyDynamoClients();
  return response.Item ? (response.Item as T) : void 0;
};

export const DeleteCommandOperation = async (options: DeleteOptions) => {
  const client = new DynamoClientInstance();
  const input: DeleteCommandInput = {
    TableName: options.TableName,
    Key: marshall(options.key),
  };
  Logger.debug(`Delete Input >: ${JSON.stringify(input)}`);
  const command = new DeleteItemCommand(input);
  await client.getDynamoDBClient.send(command);
  client.destroyDynamoClients();
  Logger.debug(`delete command successfully done!`);
};

/**
 * Perform SDK Dynamo UpdateItemCommand
 * @param options
 */
export const UpdateItemCommandOperation = async (options: UpdateOptions) => {
  const client = new DynamoClientInstance();
  const expressions = getUpdateExpressions(options.expressions);
  const input: UpdateItemInput = {
    TableName: options.TableName,
    Key: marshall(options.key),
    ExpressionAttributeNames: expressions.attributeNames,
    ExpressionAttributeValues: marshall(expressions.attributeValues),
    UpdateExpression: expressions.updateExpression,
  };
  Logger.debug(`Input params > ${JSON.stringify(input)}`);
  const command = new UpdateItemCommand(input);
  await client.getDynamoDBClient.send(command);
  client.destroyDynamoClients();
};

/**
 *
 * @param
 * @link {SearchOptions}
 * @returns
 */
export const QueryPaginationCommandOperation = async <T>(
  options: QueryPaginationOptions
): Promise<QueryPaginateResult<T>> => {
  const {
    expressions,
    index,
    pageSize,
    startingToken,
    filterExpressionAfterQueryDone,
    filterExpressionConjunction,
  } = options.searchOptions;

  const client = new DynamoClientInstance();

  let KeyConditionExpressionType = undefined;
  let filterExpressionType = undefined;

  if (expressions[0].operator === "begins_with") {
    KeyConditionExpressionType =
      toKeyConditionExpressionsBeginWith(expressions);
    filterExpressionType = filterExpressionAfterQueryDone
      ? toFilterExpressions(filterExpressionAfterQueryDone)
      : undefined;
  } else {
    KeyConditionExpressionType = toKeyConditionExpressions(expressions);
    filterExpressionType = filterExpressionAfterQueryDone
      ? toFilterExpressions(
          filterExpressionAfterQueryDone,
          filterExpressionConjunction
        )
      : undefined;
  }

  let totalCount = 0;
  let IteratorDone = false;
  let Items: Array<Record<string, any>> = [];
  let LastEvaluatedKey = startingToken ? JSON.parse(startingToken) : void 0;
  let loopCount = 0;
  let limit = pageSize;

  while (limit > 0 && !IteratorDone) {
    Logger.debug(
      `loopCount: ${loopCount++} totalCount: ${totalCount} pageSize: ${pageSize}`
    );
    const config: Omit<DynamoDBDocumentPaginationConfiguration, "client"> = {
      pageSize: limit,
      // NOTE: this doesn't seem to work correctly.
      stopOnSameToken: true,
      startingToken: startingToken,
    };

    const command: QueryCommandInput = {
      TableName: options.TableName,
      KeyConditionExpression: KeyConditionExpressionType,
      FilterExpression: filterExpressionType,
      ExpressionAttributeNames: toExpressionAttributeNames([
        ...expressions,
        ...(filterExpressionAfterQueryDone ?? []),
      ]),
      ExpressionAttributeValues: toExpressionAttributeValues([
        ...expressions,
        ...(filterExpressionAfterQueryDone ?? []),
      ]),
      IndexName: index,
      ScanIndexForward: options.ScanIndexForward,
      Limit: limit,
    };

    Logger.debug(`Input QueryPagination ${JSON.stringify(command)}`);

    const paginator = await paginateQuery(
      { client: client.getDynamoDBDocumentClient, ...config },
      command
    );

    const page = await paginator.next();
    const value = page.done ? void 0 : page.value;

    LastEvaluatedKey = value?.LastEvaluatedKey;
    // work around stopOnSameToken not working or not being documented correctly.
    IteratorDone =
      (startingToken === undefined && LastEvaluatedKey === undefined) ||
      (startingToken !== undefined && LastEvaluatedKey === undefined);

    Items = Items.concat(value?.Items ?? []);
    totalCount = totalCount + (value?.Count ?? 0);
    limit = pageSize - totalCount;
  }

  client.destroyDynamoClients();

  return {
    Items: Items as T[],
    Count: totalCount,
    IteratorDone,
    LastEvaluatedKey: LastEvaluatedKey
      ? JSON.stringify(LastEvaluatedKey)
      : void 0,
  };
};
