import * as dotenv from "dotenv";
import { resolve } from "path";

let path = resolve(__dirname, ".env");
dotenv.config({ path: path });

export const DynamoEnvTables = {
  USERS_TABLE: process.env.USERS_TABLE ?? "",
  CONNECTIONS_TABLE: process.env.CONNECTIONS_TABLE ?? "",
};

export const CognitoEnvValues = {
  USER_MANAGEMENT_POOL_ID: process.env.USER_MANAGEMENT_POOL_ID ?? "",
  USER_POOL_MANAGEMENT_CLIENT_ID:
    process.env.USER_POOL_MANAGEMENT_CLIENT_ID ?? "",
};

export const WebSocketEnvValues = {
  WEBSOCKET_API_ENDPOINT: process.env.WEBSOCKET_API_ENDPOINT ?? "",
};

export const SnsTopicEnvs = {
  NOTIFY_USER_ONLINE_TOPIC_ARN: process.env.NOTIFY_USER_ONLINE_TOPIC_ARN ?? "",
};
