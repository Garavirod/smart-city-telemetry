import { SNSEvent } from "aws-lambda";
import { WebSocketNotificationService } from "../../services/api-gw-managment";
import { DynamoSocketConnectionsService } from "../../services/dynamo";
import {
  ConnectionModel,
  ConnectionType,
} from "../../../../libs/clients/dynamodb/models/management";
import { Logger } from "../../../../libs/logger";

export const handler = async (event: SNSEvent): Promise<void> => {
  try {
    for (const record of event.Records) {
      Logger.debug(`Event record > : ${JSON.stringify(record)}`);
      const message = JSON.parse(record.Sns.Message);
      Logger.debug(`Event message > : ${JSON.stringify(message)}`);
      const connections: ConnectionModel[] =
        await DynamoSocketConnectionsService.geConnectionsByType(
          ConnectionType.OnlineUsers
        );
      await WebSocketNotificationService.notifyNewUserOnline({
        connections,
        data: message,
      });
    }
  } catch (error) {
    Logger.error(`Error on notify new user online ${JSON.stringify(error)}`);
    throw error;
  }
};
