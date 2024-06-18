import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  ParamPropertyType,
  extractDataFromEvent,
} from "../utils/pre-process-event";
import {
  InternalErrorResponse500,
  SuccessResponse200,
} from "../utils/api-response";
import { DynamoUsersService } from "../../services/dynamo";
import { Logger } from "../../../../libs/logger";
import { PaginatorQueryParams } from "../interfaces";

interface QueryStringParametersEXpected extends PaginatorQueryParams {}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const params = <QueryStringParametersEXpected>extractDataFromEvent({
      event: event,
      propertyToExtract: ParamPropertyType.QueryStringParameters,
    });

    const { users, next } = await DynamoUsersService.getActiveUsers({
      page: params.page,
      pageSize: parseInt(params.pageSize),
    });

    return SuccessResponse200({
      data: {
        users: users,
        nextPage: next,
      },
      message: "Active users",
    });
  } catch (error) {
    Logger.error(`Handler error ${JSON.stringify(error)}`);
    return InternalErrorResponse500({});
  }
};
