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
  console.debug(`isDev: ${isDev}`);
  return isDev;
};