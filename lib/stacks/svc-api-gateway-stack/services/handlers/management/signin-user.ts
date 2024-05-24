import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  ParamPropertyType,
  extractDataFromEvent,
} from "../../utils/pre-process-event";
import {
  InternalErrorResponse500,
  SuccessResponse200,
} from "../../utils/api-response";
import { Logger } from "../../../../../libs/logger";
import { UserRole, UsersModel } from "../../../../../libs/clients/dynamodb/models/management";
import { ManagementDynamoService } from "../../../../../libs/clients/dynamodb/services";
import { v4 as uuidv4 } from "uuid";
import { ManagementCognitoService } from "../../../../../libs/clients/cognito/services";
import { SignInUserModel } from "../../../cdk/api/models/management";

interface BodyParamsExpected
  extends SignInUserModel {}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {

    const params = <BodyParamsExpected>extractDataFromEvent({
      event: event,
      propertyToExtract: ParamPropertyType.Body,
    });

    // TODO Get user by email from dynamo
    // ToDO create service for get item in dynamo
    // DynamoService.getUserByKey({index:email})

    // Add user to cognito
    const token = await ManagementCognitoService.signIn({
      email: params.email,
      password: params.password,
      role:UserRole.CommonUser // user.role from dynamo
    });


    // TODO
    // Update Dynamo user online prop, create service
    // DynamoService.setUserOnlineStatus(true);

    return SuccessResponse200({
      // TODO Return user information and token
    });
  } catch (error) {
    Logger.error(`Handler error ${JSON.stringify(error)}`);
    return InternalErrorResponse500({});
  }
};
