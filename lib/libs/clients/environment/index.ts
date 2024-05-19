import * as dotenv from "dotenv";
import { resolve } from "path";

let path = resolve(__dirname, ".env");
dotenv.config({ path: path });

export const DynamoEnvTables = {
  USERS_TABLE: process.env.USERS_TABLE ?? "",
};
