import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { Logger } from "../../../../libs/logger";
import {
  InternalErrorResponse500,
  SuccessResponse200,
  UnprocessableRequestResponse403,
} from "../utils/api-response";
import {
  ConnectionModel,
  ConnectionType,
} from "../../../../libs/clients/dynamodb/models/management";
import { DynamoSocketConnectionsService } from "../../services/dynamo";

interface QueryParamsExpected {
  connectionType: ConnectionType;
}

export const handler = async (event: APIGatewayProxyWebsocketEventV2) => {
  try {
    Logger.debug(`Event: ${JSON.stringify(event)}`);

    if (!("queryStringParameters" in event)) {
      throw UnprocessableRequestResponse403({
        message: 'Lack Parameters. "connectionType" parm is needed.',
      });
    }
    const params = event.queryStringParameters as QueryParamsExpected;
    const connection: ConnectionModel = {
      connectionId: event.requestContext.connectionId,
      connectionType: params.connectionType,
    };
    await DynamoSocketConnectionsService.addNewConnection(connection);
    return SuccessResponse200({
      message: "Connection successfully done!",
    });
  } catch (error) {
    Logger.error(`Error on connection ${JSON.stringify(error)}`);
    return InternalErrorResponse500({});
  }
};
