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
import { DynamoUsersService } from "../../services/dynamo";
import { CognitoAuthService } from "../../services/cognito";
import { Logger } from "../../../../libs/logger";
import { SnsService } from "../../services/sns";

interface HeadersParamsExpected {
  authTokenId: string;
}

interface PathParamsExpected {
  userId: string;
}
interface BodyParamsExpected {
  accessToken: string;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const headers = <HeadersParamsExpected>extractDataFromEvent({
      event: event,
      propertyToExtract: ParamPropertyType.HeadersAccessToken,
    });

    if (!headers.authTokenId) {
      return UnprocessableRequestResponse403({
        message: "id Token is needed this operation",
      });
    }

    const pathParams = <PathParamsExpected>extractDataFromEvent({
      event: event,
      propertyToExtract: ParamPropertyType.PathParameters,
    });

    const bodyParams = <BodyParamsExpected>extractDataFromEvent({
      event: event,
      propertyToExtract: ParamPropertyType.Body,
    });

    const user = await DynamoUsersService.getUserById(pathParams.userId);

    if (!user) {
      return BadRequestResponse400({
        message: `No user registered with id "${pathParams.userId}"`,
      });
    }

    await CognitoAuthService.signOut(bodyParams.accessToken);

    // Update User online prop
    user.online = false;
    await DynamoUsersService.updateUserAttributes({
      userId: user.userId,
      attributesToUpdate: [
        {
          column: "online",
          newValue: user.online,
        },
      ],
    });

    await SnsService.publishUserOnlineStatus(user);

    return SuccessResponse200({
      data: { userId: user.userId },
      message: "Sign Out successfully",
    });
  } catch (error) {
    Logger.error(`Handler error ${JSON.stringify(error)}`);
    return InternalErrorResponse500({});
  }
};
