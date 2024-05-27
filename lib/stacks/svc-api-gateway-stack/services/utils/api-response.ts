import { APIGatewayProxyResult } from "aws-lambda";
import { Logger } from "../../../../libs/logger";

export interface HttpResponse {
  statusCode: HttpStatus;
  body?: any;
  headers?: any;
}

export enum HttpStatus {
  BadRequest = "400",
  Forbidden = "403",
  Success = "200",
  NotFound = "404",
  ServerError = "500",
  Unauthorized = "401",
}

const PROXY_CORS_HEADERS = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "PATCH,POST,GET,DELETE,OPTIONS",
};

export const BadRequest = (reason: string): HttpResponse => {
  return {
    statusCode: HttpStatus.BadRequest,
    body: reason,
  };
};

export const ModelResponse = <T>(model: T): HttpResponse => {
  return {
    statusCode: HttpStatus.Success,
    body: model,
  };
};

export const NotFound = (reason: string): HttpResponse => {
  return {
    statusCode: HttpStatus.NotFound,
    body: reason,
  };
};

export const Success = (): HttpResponse => {
  return {
    statusCode: HttpStatus.Success,
    body: "OK - Success",
  };
};

export const ServerErrorObject = (error: any): HttpResponse => {
  return {
    statusCode: HttpStatus.ServerError,
    body: isDev() ? error : "Internal Server Error",
  };
};

export const ProxyBadRequest = (reason: string): HttpResponse => {
  return {
    statusCode: HttpStatus.BadRequest,
    headers: PROXY_CORS_HEADERS,
    body: reason,
  };
};

export const ProxyOK = (reason: string): HttpResponse => {
  return {
    statusCode: HttpStatus.Success,
    headers: PROXY_CORS_HEADERS,
    body: reason,
  };
};

export const ProxyErrorObject = (error: any): HttpResponse => {
  return {
    statusCode: HttpStatus.ServerError,
    headers: PROXY_CORS_HEADERS,
    body: isDev() ? error : "Internal Server Error",
  };
};

const isDev = () => {
  const isDev = process.env.NODE_ENV !== "prod";
  Logger.debug(`isDev: ${isDev}`);
  return isDev;
};

export const SuccessResponse200 = (props: {
  message?: string;
  data?: any;
  extras?: any;
}): APIGatewayProxyResult => {
  const { message, extras, data } = props;
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: message ? message : "Request successfully done",
      data,
      extras,
    }),
  };
};

export const BadRequestResponse400 = (props: {
  message?: string;
  data?: any;
  extras?: any;
}): APIGatewayProxyResult => {
  const { message, extras, data } = props;
  return {
    statusCode: 400,
    body: JSON.stringify({
      message: message ? message : "Bad Request",
      data,
      extras,
    }),
  };
};

export const InternalErrorResponse500 = (props: {
  error?: any;
  data?: any;
  extras?: any;
  message?: any;
}): APIGatewayProxyResult => {
  const { error, extras, data, message:customMessage } = props;
  let message = "Unknown error";
  if (error instanceof Error) {
    message = error.message;
  }
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: `Request failed - ${customMessage ?? message}`,
      data,
      extras,
    }),
  };
};
