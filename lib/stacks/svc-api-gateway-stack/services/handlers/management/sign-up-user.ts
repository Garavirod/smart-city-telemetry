import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  ParamPropertyType,
  extractDataFromEvent,
} from "../../utils/pre-process-event";
import {
  InternalErrorResponse500,
  SuccessResponse200,
  UnprocessableRequestResponse403,
} from "../../utils/api-response";
import { Logger } from "../../../../../libs/logger";
import { UsersModel } from "../../../../../libs/clients/dynamodb/models/management";
import { ManagementDynamoService } from "../../../../../libs/clients/dynamodb/services";
import { v4 as uuidv4 } from "uuid";
import { ManagementCognitoService } from "../../../../../libs/clients/cognito/services";
import { SignupUsersModel } from "../../../cdk/api/models/management";
import { GlobalEnvironmentVars } from "../../../../../libs/environment";
import { UsernameExistsException } from "@aws-sdk/client-cognito-identity-provider";

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
      status: true,
      online: false,
      role: params.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      visibleDependencies: params.visibleDependencies,
      isVerified: setVerificationStatus(),
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
