import * as dotenv from "dotenv";
import { resolve } from "path";

let path = resolve(__dirname, ".env");
dotenv.config({ path: path });

export const DynamoEnvTables = {
  USERS_TABLE: process.env.USERS_TABLE ?? "",
};


export const CognitoEnvValues = {
  USER_POOL_ID: process.env.USER_POOL_ID ?? "",
  USER_POOL_CLIENT_ID: process.env.USER_POOL_CLIENT_ID ?? "",
}