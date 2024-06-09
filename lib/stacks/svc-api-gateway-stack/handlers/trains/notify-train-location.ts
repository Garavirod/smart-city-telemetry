import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Logger } from "../../../../libs/logger";
import { InternalErrorResponse500, SuccessResponse200 } from "../utils/api-response";
/* interface BodyParamsExpected extends SignInUserModel {} */

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    /* const params = <BodyParamsExpected>extractDataFromEvent({
      event: event,
      propertyToExtract: ParamPropertyType.Body,
    }); */

    Logger.debug(`Event handler >: ${JSON.stringify(event)}`);

    return SuccessResponse200({});
  } catch (error) {
    Logger.error(`Handler error ${JSON.stringify(error)}`);
    return InternalErrorResponse500({});
  }
};
