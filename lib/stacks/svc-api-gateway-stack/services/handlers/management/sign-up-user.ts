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
import { UsersModel } from "../../../../../libs/clients/dynamodb/models/management";
import { ManagementDynamoService } from "../../../../../libs/clients/dynamodb/services";
import { v4 as uuidv4 } from "uuid";
import { ManagementCognitoService } from "../../../../../libs/clients/cognito/services";
import { SignupUsersModel } from "../../../cdk/api/models/management";

interface BodyParamsExpected
  extends SignupUsersModel {}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const params = <BodyParamsExpected>extractDataFromEvent({
      event: event,
      propertyToExtract: ParamPropertyType.Body,
    });

    const user: UsersModel = {
      userId: uuidv4(),
      name: params.name,
      email: params.email,
      lastName: params.lastName,
      status: true,
      online: false,
      role: params.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      visibleDependencies: params.visibleDependencies,
    };

    // Add user to cognito
    await ManagementCognitoService.signUp({
      userRole: user.role,
      email: user.email,
      password: params.password,
    });

    // Add user to dynamo db
    await ManagementDynamoService.addNewUser(user);

    return SuccessResponse200({
      data: user,
    });
  } catch (error) {
    Logger.error(`Handler error ${JSON.stringify(error)}`);
    return InternalErrorResponse500({});
  }
};
