import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { extractDataFromEvent } from "../../utils/pre-process-event";
import {
  InternalErrorResponse500,
  SuccessResponse200,
} from "../../utils/api-response";
import { Logger } from "../../../../../libs/logger";
import { UsersModel } from "../../../../../libs/clients/dynamodb/models/management";
import { ManagementService } from "../../../../../libs/clients/dynamodb/services";
import { v4 as uuidv4 } from "uuid";

interface BodyParamsExpected
  extends Omit<
    UsersModel,
    "userId" | "status" | "createdAt" | "online" | "updatedAt"
  > {
    password:string;
  }

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const params = <BodyParamsExpected>extractDataFromEvent({
      event: event,
      propertyToExtract: "body",
    });

    // TODO: Add model to API rest to validate params before reach lambda out
    if (!params) {
      throw new Error(`"No query string parameters"`);
    }

    const user: UsersModel = {
      userId: uuidv4(),
      name: params.name,
      email: params.lastName,
      lastName: params.lastName,
      status: true,
      online: false,
      role: params.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      visibleDependencies: params.visibleDependencies,
    };
    // TODO: Create cognito user via service

    // Add user to dynamo db
    const response = await ManagementService.addNewUser(user);

    return SuccessResponse200({
      data: response,
    });
  } catch (error) {
    Logger.error(`Handler error ${JSON.stringify(error)}`);
    return InternalErrorResponse500({});
  }
};
