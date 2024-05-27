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
import { ManagementDynamoService } from "../../../../../libs/clients/dynamodb/services";
import { ManagementCognitoService } from "../../../../../libs/clients/cognito/services";
import { VerificationCodeModel } from "../../../cdk/api/models/management";

interface BodyParamsExpected extends VerificationCodeModel {}

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

    // Add user to cognito
    await ManagementCognitoService.VerificationCode({
      email: params.email,
      code: params.code,
    });

    // Update User online prop
    await ManagementDynamoService.updateUserAttributes({
      userId: user.userId,
      attributesToUpdate: [
        {
          column: "isVerified",
          newValue: true,
        },
      ],
    });

    return SuccessResponse200({
      data: { userId: user.userId },
      message: "Verification code successfully done.",
    });
  } catch (error) {
    Logger.error(`Handler error ${JSON.stringify(error)}`);
    return InternalErrorResponse500({
        message: "Error on verifying code"
    });
  }
};
