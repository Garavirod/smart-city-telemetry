import { APIGatewayProxyWebsocketEventV2 } from "aws-lambda";
import { Logger } from "../../../../libs/logger";
import { SuccessResponse200 } from "../utils/api-response";

export const handler = async(event:APIGatewayProxyWebsocketEventV2) => {
    
    Logger.debug(`Event: ${JSON.stringify(event)}`);

    return SuccessResponse200({});
}