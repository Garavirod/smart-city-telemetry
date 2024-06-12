import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { Logger } from "../../../../libs/logger";
import {
  InternalErrorResponse500,
  SuccessResponse200,
} from "../utils/api-response";

import { DynamoSocketConnectionsService } from "../../services/dynamo";

export const handler = async (event: APIGatewayProxyWebsocketEventV2) => {
  try {
    Logger.debug(`Event: ${JSON.stringify(event)}`);
    const connectionId = event.requestContext.connectionId;
    await DynamoSocketConnectionsService.DeleteConnection(connectionId);
    return SuccessResponse200({
      message: "Disconnection successfully done!",
    });
  } catch (error) {
    Logger.error(`Error on disconnection handler ${JSON.stringify(error)}`);
    return InternalErrorResponse500({});
  }
};
