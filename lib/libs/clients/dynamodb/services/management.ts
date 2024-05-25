import { UsersModel } from "../models/management";
import {
  PutCommandOperation,
  QueryPaginationCommandOperation,
} from "../operations/dynamo-operations";
import { UsersTableColumnSearch, UsersTableIndex, type PaginationServiceResponse } from "./types";
import { DynamoEnvTableIndices, DynamoEnvTables } from "../../environment";
import { Logger } from "../../../logger";

export const getUsers = async (props: { page?: any; pageSize: number }) => {
  try {
    const table = DynamoEnvTables.USERS_TABLE;
    const searchResult = await QueryPaginationCommandOperation<UsersModel>({
      TableName: table,
      ScanIndexForward: false,
      searchOptions: {
        startingToken: props.page,
        pageSize: props.pageSize,
        index:UsersTableIndex.EmailICreatedAtIndex,
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

type getUserIndexOptions = {
  tableIndex: UsersTableIndex;
  tableColumn: UsersTableColumnSearch;
  value: string;
};
export const getUserByGSIndex = async (options: getUserIndexOptions) => {
  try {
    const table = DynamoEnvTables.USERS_TABLE;
    const index = getUsersTableGSIEnv(options.tableIndex);
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

const getUsersTableGSIEnv = (index: UsersTableIndex) => {
  const envIndices = {
    [UsersTableIndex.EmailICreatedAtIndex]:
      DynamoEnvTableIndices.USERS_TABLE_EMAIL_INDEX,
  };
  return envIndices[index];
};
