import { UsersModel } from "../models/management";
import {
  PutCommandOperation,
  QueryPaginationCommandOperation,
  UpdateItemCommandOperation,
} from "../operations/dynamo-operations";
import {
  UsersTableColumnSearch,
  type PaginationServiceResponse,
} from "./types";
import { DynamoEnvTables } from "../../environment";
import { Logger } from "../../../logger";
import { UpdateExpression } from "../operations/types";
import { DynamoTableIndex } from "../../../../stacks/shared/enums/dynamodb";

export const getUsers = async (props: { page?: any; pageSize: number }) => {
  try {
    const table = DynamoEnvTables.USERS_TABLE;
    const searchResult = await QueryPaginationCommandOperation<UsersModel>({
      TableName: table,
      ScanIndexForward: false,
      searchOptions: {
        startingToken: props.page,
        pageSize: props.pageSize,
        index: DynamoTableIndex.UsersTableIndex.EmailICreatedAtIndex,
        expressions: [
          {
            column: "status",
            value: true,
            operator: "=",
          },
        ],
      },
    });

    const response: PaginationServiceResponse<UsersModel> = {
      data: searchResult.Items,
      count: searchResult.Count,
      nextPage: searchResult.LastEvaluatedKey,
    };
    return response;
  } catch (error) {
    throw Error(`Error on getting user via service ${error}`);
  }
};
export const getUserById = async () => {
  try {
  } catch (error) {}
};

export const getACtiveUsers = async () => {
  try {
  } catch (error) {}
};

export const deleteUserById = async () => {
  try {
  } catch (error) {}
};

export const addNewUser = async (item: UsersModel) => {
  try {
    const table = DynamoEnvTables.USERS_TABLE;
    await PutCommandOperation({
      TableName: table,
      Item: item,
    });
  } catch (error) {
    Logger.error(`Error on putting new user via service ${error}`);
    throw Error(`${error}`);
  }
};

export const getUserByEmail = async (email: string) => {
  const user = await getUserByGSIndex({
    tableColumn: "email",
    tableIndex: DynamoTableIndex.UsersTableIndex.EmailICreatedAtIndex,
    value: email,
  });
  Logger.debug(`getUserByEmail response >: ${JSON.stringify(user)}`);
  return user;
};

type getUserIndexOptions = {
  tableIndex: string;
  tableColumn: UsersTableColumnSearch;
  value: string;
};
const getUserByGSIndex = async (options: getUserIndexOptions) => {
  try {
    const table = DynamoEnvTables.USERS_TABLE;
    const index = options.tableIndex;
    const pageSize = 1;
    let startingToken = undefined;
    const response = await QueryPaginationCommandOperation<UsersModel>({
      TableName: table,
      ScanIndexForward: true,
      searchOptions: {
        pageSize,
        startingToken,
        index,
        expressions: [
          {
            column: options.tableColumn,
            value: options.value,
            operator: "=",
          },
        ],
      },
    });
    return response.Count > 0 ? response.Items[0] : void 0;
  } catch (error) {
    Logger.error(`Error on getting item via service ${error}`);
    throw Error(`${error}`);
  }
};

type updateItemOptions = {
  attributesToUpdate: UpdateExpression[];
  userId: string;
};
export const updateUserAttributes = async (options: updateItemOptions) => {
  try {
    const table = DynamoEnvTables.USERS_TABLE;
    await UpdateItemCommandOperation({
      TableName: table,
      key: { userId: options.userId },
      expressions: options.attributesToUpdate,
    });
  } catch (error) {
    Logger.error(`Error on updating item via service ${error}`);
    throw Error(`${error}`);
  }
};
