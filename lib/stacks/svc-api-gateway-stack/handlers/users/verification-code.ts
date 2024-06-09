import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  ParamPropertyType,
  extractDataFromEvent,
} from "../utils/pre-process-event";
import {
  BadRequestResponse400,
  InternalErrorResponse500,
  SuccessResponse200,
  UnprocessableRequestResponse403,
} from "../utils/api-response";

import {
  ExpiredCodeException,
  CodeMismatchException,
} from "@aws-sdk/client-cognito-identity-provider";
import { VerificationCodeModel } from "../../cdk/builders/api/models/users";
import { DynamoUsersService } from "../../services/dynamo";
import { CognitoAuthService } from "../../services/cognito";
import { Logger } from "../../../../libs/logger";

interface BodyParamsExpected extends VerificationCodeModel {}

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

    // Add user to cognito
    await CognitoAuthService.VerificationCode({
      email: params.email,
      code: params.code,
    });

    // Update User online prop
    await DynamoUsersService.updateUserAttributes({
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
    if (error instanceof ExpiredCodeException) {
      return UnprocessableRequestResponse403({
        message: "Code has expired, please generate a new one.",
      });
    }
    if (error instanceof CodeMismatchException) {
      return UnprocessableRequestResponse403({
        message: "Invalid code format, please review the code.",
      });
    }
    return InternalErrorResponse500({
      message: "Error on verifying code",
    });
  }
};
