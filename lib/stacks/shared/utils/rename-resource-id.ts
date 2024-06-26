import { DeployEnvironment, GlobalEnvironmentVars } from "../../../libs/environment";

export const createResourceNameId = (name: string) => {
  if (GlobalEnvironmentVars.DEPLOY_ENVIRONMENT === "") {
    throw Error("No DEPLOY_ENVIRONMENT variable");
  }
  const envName = GlobalEnvironmentVars.DEPLOY_ENVIRONMENT as DeployEnvironment;
  return `${envName}-${name}`;
};
