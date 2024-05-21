import { CognitoBuilder } from "../../../../libs/cdk-builders/CognitoBuilder";
import { CognitoUsersPoolClientNames, CognitoUsersPoolNames } from "./types";

export const buildCognitoConstructs = (builder: CognitoBuilder) => {
  builder.createUserPool({
    userPoolNameId: CognitoUsersPoolNames.ManagementUsersPool,
  });

  builder.createCognitoUserPoolClient({
    userPoolClientNameId: CognitoUsersPoolClientNames.ManagementUsersPoolCli,
    userPoolNameId: CognitoUsersPoolNames.ManagementUsersPool,
  });
};
