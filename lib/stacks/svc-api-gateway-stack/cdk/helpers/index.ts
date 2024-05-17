import { GlobalEnvironmentVars } from "../../../../libs/environment";
import { DeployEnvironment } from "../types";

export const getEnvironmentNameResource = (name: string) => {
  if (GlobalEnvironmentVars.DEPLOY_ENVIRONMENT === "") {
    throw Error("No DEPLOY_ENVIRONMENT variable");
  }
  const envName = GlobalEnvironmentVars.DEPLOY_ENVIRONMENT as DeployEnvironment;
  return `${envName}-${name}`;
};
