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
import { WebSocketNotificationService } from "../../services/api-gw-managment";
import { SignInUserModel } from "../../cdk/builders/api/models/users";
import { DynamoUsersService } from "../../services/dynamo";
import { CognitoAuthService } from "../../services/cognito";
import { Logger } from "../../../../libs/logger";

interface BodyParamsExpected extends SignInUserModel {}

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
    const token = await CognitoAuthService.signIn({
      email: user.email,
      password: params.password,
      role: user.role,
    });

    if (!token) {
      return InternalErrorResponse500({
        message: "Token could not be generated, please try again.",
      });
    }

    // Update User online prop
    await DynamoUsersService.updateUserAttributes({
      userId: user.userId,
      attributesToUpdate: [
        {
          column: "online",
          newValue: true,
        },
      ],
    });

    await WebSocketNotificationService.notifyNewUserOnline(user);

    return SuccessResponse200({
      data: { token, userId: user.userId },
      message: "Sign In successfully",
    });
  } catch (error) {
    Logger.error(`Handler error ${JSON.stringify(error)}`);
    return InternalErrorResponse500({});
  }
};
