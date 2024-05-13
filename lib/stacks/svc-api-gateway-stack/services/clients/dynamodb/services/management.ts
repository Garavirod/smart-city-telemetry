import { UsersModel } from "../models/management";
import { QueryPaginationCommandOperation } from "../operations/dynamo-operations";
import { ManagementTables } from "../tables/tables";
import { ManagementTablesIndex } from "../tables/tables-index";
import { type PaginationServiceResponse } from "./types";

export const getUsers = async (props: { page?: any; pageSize: number }) => {
  try {
    const searchResult = await QueryPaginationCommandOperation<UsersModel>({
      TableName: ManagementTables.Users,
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
