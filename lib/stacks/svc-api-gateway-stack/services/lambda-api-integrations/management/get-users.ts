import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { extractDataFromEvent } from "../../utils/pre-process-event";
import {
  InternalErrorResponse500,
  SuccessResponse200,
} from "../../utils/api-response";
import { QueryParamsPagination } from "../types";
import { ManagementService } from "../../clients/dynamodb/services";

interface QueryParamsExpected extends QueryParamsPagination {
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const params = <QueryParamsExpected>extractDataFromEvent({
      event: event,
      propertyToExtract: "queryStringParameters",
    });

    if (!params) {
      throw new Error(`"No query string parameters"`);
    }
    const {
      data: users,
      nextPage,
      count,
    } = await ManagementService.getUsers({
      pageSize: parseInt(params.page_size),
    });
    
    return SuccessResponse200({
      data: {
        users,
        nextPage,
        count,
      },
    });
  } catch (error) {
    return InternalErrorResponse500({ error: error });
  }
};
