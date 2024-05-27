import * as dotenv from "dotenv";
import { resolve } from "path";


export type DeployEnvironment = "Dev" | "Prod" | "Qa";

let path = resolve(__dirname, ".env");
dotenv.config({ path: path });

export const GlobalEnvironmentVars = {
  DEPLOY_ENVIRONMENT: process.env.DEPLOY_ENVIRONMENT ?? "",
  LOGGER_LEVEL: process.env.LOGGER_LEVEL ?? "",
};
