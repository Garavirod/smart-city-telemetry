import { APIGatewayProxyEvent } from "aws-lambda";
import { Logger } from "../../../../libs/logger";

export enum ParamPropertyType {
  Body = "body",
  PathParameters = "pathParameters",
  Headers = "headers",
  HeadersAccessToken = "headersAccessToken",
  QueryStringParameters = "queryStringParameters",
}

export const extractDataFromEvent = <T>(props: {
  event: APIGatewayProxyEvent;
  propertyToExtract: ParamPropertyType;
}) => {
  const { event, propertyToExtract } = props;

  if (propertyToExtract === ParamPropertyType.Body) {
    Logger.debug(`${propertyToExtract} content >: ${event.body}`);
    const data = event.body ? (JSON.parse(event.body) as T) : void 0;
    return data;
  }

  if (propertyToExtract === ParamPropertyType.QueryStringParameters) {
    Logger.debug(
      `${propertyToExtract} content >: ${JSON.stringify(
        event.queryStringParameters
      )}`
    );
    const data = event.queryStringParameters
      ? (event.queryStringParameters as T)
      : void 0;
    return data;
  }

  if (propertyToExtract === ParamPropertyType.HeadersAccessToken) {
    Logger.debug(
      `${propertyToExtract} content >: ${JSON.stringify(event.headers)}`
    );
    const data = event.headers.Authorization
      ? ({ authTokenId: event.headers.Authorization } as T)
      : void 0;

    return data;
  }

  if (propertyToExtract === ParamPropertyType.PathParameters) {
    Logger.debug(
      `${propertyToExtract} content >: ${JSON.stringify(event.pathParameters)}`
    );
    const data = event.pathParameters ? (event.pathParameters as T) : void 0;

    return data;
  }

  const data = event.pathParameters ? (event.pathParameters as T) : void 0;
  return data;
};
