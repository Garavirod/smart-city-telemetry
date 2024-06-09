import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  ParamPropertyType,
  extractDataFromEvent,
} from "../utils/pre-process-event";
import {
  BadRequestResponse400,
  InternalErrorResponse500,
  SuccessResponse200,
} from "../utils/api-response";
import { EmailModel } from "../../cdk/builders/api/models/users";
import { DynamoUsersService } from "../../services/dynamo";
import { CognitoAuthService } from "../../services/cognito";
import { Logger } from "../../../../libs/logger";

interface BodyParamsExpected extends EmailModel {}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const params = <BodyParamsExpected>extractDataFromEvent({
      event: event,
      propertyToExtract: ParamPropertyType.Body,
    });

    const user = await DynamoUsersService.getUserByEmail(params.email);

    if (!user) {
      return BadRequestResponse400({
        message: `No user registered with an email "${params.email}"`,
      });
    }

    await CognitoAuthService.regenerateVerificationCode(user.email);

    return SuccessResponse200({
      data: { userId: user.userId, destination: user.email },
      message: "Code sent successfully",
    });
  } catch (error) {
    Logger.error(`Handler error ${error}`);
    return InternalErrorResponse500({});
  }
};
