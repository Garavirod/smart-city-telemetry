import { UsersModel } from "../models/management";
import {
  PutCommandOperation,
  QueryPaginationCommandOperation,
} from "../operations/dynamo-operations";
import { ManagementTablesIndex } from "../tables/tables-index";
import { type PaginationServiceResponse } from "./types";
import { DynamoEnvTables } from "../../environment";
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
        index: ManagementTablesIndex.UsersTableIndex,
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
