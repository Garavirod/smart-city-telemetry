import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { QueryStringParametersPagination } from "../../../cdk/api/interfaces/shared";
import { extractDataFromEvent } from "../../utils/pre-process-event";
import { InternalErrorResponse500, SuccessResponse200 } from "../../utils/api-response";


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
      throw new Error("No query string parameters");
    }
    const users = [
      {
        user_id: 1111,
        name: "Rodrigo García",
      },
    ];
    return SuccessResponse200({ data: users });
  } catch (error) {
    return InternalErrorResponse500({ error: error });
  }
};
