import { App } from "aws-cdk-lib";
import { GenericStack } from "./GenericStack";

enum StackNames {
  SvcApiGateway = "SvcApiGateway",
}

const appStack = new App();
const appStackScopes = {
  SvcApiGateway: new GenericStack(appStack, StackNames.SvcApiGateway),
};

export { appStackScopes };
