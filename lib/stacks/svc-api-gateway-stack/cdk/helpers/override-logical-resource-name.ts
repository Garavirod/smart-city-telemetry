import { CfnResource, Resource } from "aws-cdk-lib";
import { DeployEnvironment } from "../types";
import { resolve } from "path";
import * as dotenv from "dotenv";

let path = resolve(__dirname, "../.env");
dotenv.config({ path: path });

export const overrideLogicalResourceName = (props: {
  resource: Resource;
  appName: string;
}) => {
  const { DEPLOY_ENVIRONMENT } = process.env;
  if (!DEPLOY_ENVIRONMENT) {
    throw Error("No DEPLOY_ENVIRONMENT variable");
  }
  const envName = DEPLOY_ENVIRONMENT as DeployEnvironment;
  const newName = `${props.appName}-${props.resource.node.id}-${envName}`;
  (props.resource.node.defaultChild as CfnResource).overrideLogicalId(newName);
};
