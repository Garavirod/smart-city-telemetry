import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  InternalErrorResponse500,
  SuccessResponse200,
} from "../../api/utils/api-response";
import { extractDataFromEvent } from "../../api/utils/pre-process-event";
import { QueryStringParametersPagination } from "../../api/interfaces/shared";

interface QueryParamsExpected extends QueryStringParametersPagination {
  fake: string;
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
      throw new Error("No query string parameters into request");
    }
    const users = [
      {
        dependency_id: 1111,
        name: "Tren ligero",
      },
    ];
    return SuccessResponse200({ data: users });
  } catch (error) {
    return InternalErrorResponse500({ error: error });
  }
};
