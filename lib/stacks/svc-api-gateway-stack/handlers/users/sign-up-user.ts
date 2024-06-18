import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  ParamPropertyType,
  extractDataFromEvent,
} from "../utils/pre-process-event";
import {
  InternalErrorResponse500,
  SuccessResponse200,
  UnprocessableRequestResponse403,
} from "../utils/api-response";
import { v4 as uuidv4 } from "uuid";

import { UsernameExistsException } from "@aws-sdk/client-cognito-identity-provider";
import { SignupUsersModel } from "../../cdk/builders/api/models/users";
import { UserStatus, UsersModel } from "../../../../libs/clients/dynamodb/models/management";
import { CognitoAuthService } from "../../services/cognito";
import { DynamoUsersService } from "../../services/dynamo";
import { Logger } from "../../../../libs/logger";
import { GlobalEnvironmentVars } from "../../../../libs/environment";

interface BodyParamsExpected extends SignupUsersModel {}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const params = <BodyParamsExpected>extractDataFromEvent({
    event: event,
    propertyToExtract: ParamPropertyType.Body,
  });
  try {
    const user: UsersModel = {
      userId: uuidv4(),
      name: params.name,
      email: params.email,
      lastName: params.lastName,
      status: UserStatus.Active,
      online: false,
      role: params.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      visibleDependencies: params.visibleDependencies,
      isVerified: setVerificationStatus(),
    };

    // Add user to cognito
    await CognitoAuthService.signUp({
      userRole: user.role,
      email: user.email,
      password: params.password,
    });

    // Add user to dynamo db
    await DynamoUsersService.addNewUser(user);

    return SuccessResponse200({
      data: user,
    });
  } catch (error) {
    Logger.error(`Handler error ${JSON.stringify(error)}`);
    if (error instanceof UsernameExistsException) {
      return UnprocessableRequestResponse403({
        message: `A user with the email ${params.email} already exist.`,
      });
    }
    return InternalErrorResponse500({});
  }
};

/** For security, In "Prod" environment
 * user must verify its own code */
const setVerificationStatus = () =>
  GlobalEnvironmentVars.DEPLOY_ENVIRONMENT !== "Prod";
