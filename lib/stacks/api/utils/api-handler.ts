import { APIGatewayProxyCallback, Context } from "aws-lambda";
import { type HttpResponse, HttpStatus } from "./api-response";
import { preProcessEvent } from "./pre-process-event";
import { ServiceIdEvent } from "../events/events";

export type ApiGatewayHandler<TEvent extends ServiceIdEvent> = (
  event: TEvent,
  context: Context,
  callback: APIGatewayProxyCallback
) => Promise<HttpResponse>;

export const apiHandler = <TEvent extends ServiceIdEvent>(
  eventHandler: ApiGatewayHandler<TEvent>
) => {
  const handler = async (
    event: object,
    context: Context,
    callback: APIGatewayProxyCallback
  ) => {
    try {

      const handlerEvent = preProcessEvent<TEvent>(event);
      if (!handlerEvent.service_id) {
        callback(
          `${HttpStatus.BadRequest} - expected a service_id into the context`
        );
        return;
      }
      const response = await eventHandler(handlerEvent, context, callback);
      if (response.statusCode === HttpStatus.Success) {
        return response.body;
      }
      callback(`${response.statusCode} - ${response.body}`);
    } catch (error) {
      // TODO: remove this when logger handles errors properly and can output a stack.
      // log.error(`handler: ${error.toString()}`);
      console.log(error);
      /* xray.error(error);
      xray.close(); */
      callback(`${HttpStatus.ServerError} - ${error}`);
    }
  };

  return handler;
};
