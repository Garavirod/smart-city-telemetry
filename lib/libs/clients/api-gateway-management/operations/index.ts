import {
  PostToConnectionCommand,
  PostToConnectionCommandInput,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { ApiGatewayManagementInstance } from "../client";
import { Logger } from "../../../logger";

type postToConnectionOptions = {
  connectionId: string;
  endpoint: string;
  data: any;
};
export const PostToConnectionCommandOperation = async (
  options: postToConnectionOptions
) => {
  Logger.debug(`PostToConnection Arguments >: ${JSON.stringify(options)}`);
  const client = new ApiGatewayManagementInstance(options.endpoint);
  const input: PostToConnectionCommandInput = {
    ConnectionId: options.connectionId,
    Data: JSON.stringify(options.data),
  };
  const command = new PostToConnectionCommand(input);
  Logger.debug(`PostToConnection Input >: ${JSON.stringify(input)}`);
  await client.getClient.send(command);
};
