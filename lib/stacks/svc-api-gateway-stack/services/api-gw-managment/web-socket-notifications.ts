import { PostToConnectionCommandOperation } from "../../../../libs/clients/api-gateway-management/operations";
import {
  ConnectionModel,
  ConnectionType,
  UsersModel,
} from "../../../../libs/clients/dynamodb/models/management";
import { Logger } from "../../../../libs/logger";
import { DynamoSocketConnectionsService } from "../dynamo";
import { WebSocketEnvValues } from "../env";

export const notifyNewUserOnline = async (newUserOnline: UsersModel) => {
  try {
    const connections: ConnectionModel[] =
      await DynamoSocketConnectionsService.geConnectionsByType(
        ConnectionType.OnlineUsers
      );
    const endpoint = WebSocketEnvValues.WEBSOCKET_API_ENDPOINT;
    for (const connection of connections) {
      await PostToConnectionCommandOperation({
        connectionId: connection.connectionId,
        data: newUserOnline,
        endpoint,
      });
    }
  } catch (error) {
    Logger.error(`Error on notifyNewUserSignedIn via service ${error}`);
    throw error;
  }
};
