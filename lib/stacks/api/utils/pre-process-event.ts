import { APIGatewayProxyEvent } from "aws-lambda";

export const extractDataFromEvent = <T>(props: {
  event: APIGatewayProxyEvent;
  propertyToExtract:
    | "body"
    | "pathParameters"
    | "headers"
    | "queryStringParameters";
}) => {


  const { event, propertyToExtract } = props;

  if (propertyToExtract === "body") {
    console.debug(`${propertyToExtract} content >: ${JSON.stringify(event.body)}`)
    const data = event.body ? (JSON.parse(event.body) as T) : void 0;
    return data;
  }

  if (propertyToExtract === "queryStringParameters") {
    console.debug(`${propertyToExtract} content >: ${JSON.stringify(event.queryStringParameters)}`)
    const data = event.queryStringParameters
      ? (event.queryStringParameters as T)
      : void 0;
    return data;
  }

  const data = event.pathParameters ? (event.pathParameters as T) : void 0;
  return data;
};
