import { DynamoTableIndex } from "../../../shared/enums/dynamodb";
import { Logger } from "../../../../libs/logger";
import {
  ConnectionModel,
  ConnectionType,
} from "../../../../libs/clients/dynamodb/models/management";
import { PutCommandOperation, QueryPaginationCommandOperation } from "../../../../libs/clients/dynamodb/operations/dynamo-operations";
import { QueryPaginateResult } from "../../../../libs/clients/dynamodb/operations/types";
import { DynamoEnvTables } from "../env";
import { ConnectionTableColumnSearch } from "./table-search-columns";

export const geConnectionsByType = async (type: ConnectionType) => {
  const connections = await getConnectionByGSIndex({
    tableColumn: "connectionType",
    tableIndex: DynamoTableIndex.ConnectionsTableIndex.ConnectionTypeIndex,
    value: type,
  });
  Logger.debug(
    `get connections by type response >: ${JSON.stringify(connections)}`
  );
  return connections;
};

type getConnectionIndexOptions = {
  tableIndex: string;
  tableColumn: ConnectionTableColumnSearch;
  value: string;
};
const getConnectionByGSIndex = async (options: getConnectionIndexOptions) => {
  try {
    const table = DynamoEnvTables.CONNECTIONS_TABLE;
    const index = options.tableIndex;
    const pageSize = 1000;
    let startingToken: string | undefined = undefined;
    let connections: ConnectionModel[] = [];
    do {
      const response: QueryPaginateResult<ConnectionModel> =
        await QueryPaginationCommandOperation<ConnectionModel>({
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
      startingToken = response.LastEvaluatedKey;
      connections = [...connections, ...response.Items];
      
    } while (startingToken);
    return connections;
  } catch (error) {
    Logger.error(`Error on getting items via service ${error}`);
    throw error;
  }
};


export const addNewConnection = async (item: ConnectionModel) => {
  try {
    const table = DynamoEnvTables.CONNECTIONS_TABLE;
    await PutCommandOperation({
      TableName: table,
      Item: item,
    });
  } catch (error) {
    Logger.error(`Error on putting new connection via service ${error}`);
    throw Error(`${error}`);
  }
};