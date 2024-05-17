import { CfnResource, Resource } from "aws-cdk-lib";
import { DeployEnvironment } from "../types";
import { resolve } from "path";
import * as dotenv from "dotenv";

let path = resolve(__dirname, "../.env");
dotenv.config({ path: path });

export const overrideLogicalResourceName = (props: { resource: Resource }) => {
  const { DEPLOY_ENVIRONMENT } = process.env;
  if (!DEPLOY_ENVIRONMENT) {
    throw Error("No DEPLOY_ENVIRONMENT variable");
  }
  const envName = DEPLOY_ENVIRONMENT as DeployEnvironment;
  const newName = `${envName}SvcApiGateway${props.resource.node.id}`;
  const sanitizedNewName = newName.replace(/[^a-zA-Z0-9]/g, "");
  (props.resource.node.defaultChild as CfnResource).overrideLogicalId(
    sanitizedNewName
  );
};

export const getEnvironmentNameResource = (name: string) => {
  const { DEPLOY_ENVIRONMENT } = process.env;
  if (!DEPLOY_ENVIRONMENT) {
    throw Error("No DEPLOY_ENVIRONMENT variable");
  }
  const envName = DEPLOY_ENVIRONMENT as DeployEnvironment;
  return `${envName}-${name}`;
};
