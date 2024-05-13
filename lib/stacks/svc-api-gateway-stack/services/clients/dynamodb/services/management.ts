import { QueryPaginationCommandOperation } from "../operations/dynamo-operations";
import { ManagementTables } from "../tables/tables";
import { ManagementTablesIndex } from "../tables/tables-index";

export const getUsers = async () => {
  try {
    const users = await QueryPaginationCommandOperation({
      TableName: ManagementTables.Users,
      ScanIndexForward: false,
      searchOptions: {
        startingToken: "",
        pageSize: 100,
        index: ManagementTablesIndex.UsersTableIndex,
        filterExpressionAfterQueryDone: [
          {
            column: "user_id",
            value: "unknown",
            operator: "<>",
          },
        ],
        expressions: [
          {
            column: "status",
            value: "active",
            operator: "=",
          },
        ],
      },
    });
  } catch (error) {}
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
