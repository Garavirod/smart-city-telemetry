import { PostToConnectionCommandOperation } from "../../../../libs/clients/api-gateway-management/operations";
import { ConnectionModel } from "../../../../libs/clients/dynamodb/models/management";
import { Logger } from "../../../../libs/logger";
import { WebSocketEnvValues } from "../env";

type notifyWebSocketConnectionsOptions = {
  connections: ConnectionModel[];
  data: any;
};
export const sendMessage = async (
  options: notifyWebSocketConnectionsOptions
) => {
  try {
    const endpoint = WebSocketEnvValues.WEBSOCKET_API_ENDPOINT;
    for (const connection of options.connections) {
      await PostToConnectionCommandOperation({
        connectionId: connection.connectionId,
        data: options.data,
        endpoint,
      });
    }
  } catch (error) {
    Logger.error(`Error on notifyNewUserSignedIn via service ${error}`);
    throw error;
  }
};
