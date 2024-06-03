import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  ParamPropertyType,
  extractDataFromEvent,
} from "../../utils/pre-process-event";
import {
  BadRequestResponse400,
  InternalErrorResponse500,
  SuccessResponse200,
} from "../../utils/api-response";
import { Logger } from "../../../../../libs/logger";
import { UserRole } from "../../../../../libs/clients/dynamodb/models/management";
import { ManagementDynamoService } from "../../../../../libs/clients/dynamodb/services";
import { ManagementCognitoService } from "../../../../../libs/clients/cognito/services";
import { EmailModel } from "../../../cdk/builders/api/models/management";

interface BodyParamsExpected extends EmailModel {}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const params = <BodyParamsExpected>extractDataFromEvent({
      event: event,
      propertyToExtract: ParamPropertyType.Body,
    });

    const user = await ManagementDynamoService.getUserByEmail(params.email);

    if (!user) {
      return BadRequestResponse400({
        message: `No user registered with an email "${params.email}"`,
      });
    }

    await ManagementCognitoService.regenerateVerificationCode(user.email);

    return SuccessResponse200({
      data: { userId: user.userId, destination: user.email },
      message: "Code sent successfully",
    });
  } catch (error) {
    Logger.error(`Handler error ${error}`);
    return InternalErrorResponse500({});
  }
};
