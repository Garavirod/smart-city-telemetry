import { CognitoBuilder } from "../../../../libs/cdk-builders/CognitoBuilder";
import {
  CognitoUsersPoolClientNames,
  CognitoUsersPoolNames,
} from "../../../shared/enums/cognito";

export const buildCognitoConstructs = (builder: CognitoBuilder) => {
  builder.createUserPool({
    userPoolNameId: CognitoUsersPoolNames.ManagementUsersPool,
    customAttributes: [
      {
        nameAttribute: "role",
        mutable: true,
      },
    ],
  });

  builder.createUserPool({
    userPoolNameId: CognitoUsersPoolNames.CommonUsersPool,
    customAttributes: [
      {
        nameAttribute: "role",
        mutable: true,
      },
    ],
  });

  builder.createCognitoUserPoolClient({
    userPoolClientNameId: CognitoUsersPoolClientNames.ManagementUsersPoolCli,
    userPoolNameId: CognitoUsersPoolNames.ManagementUsersPool,
  });

  builder.createCognitoUserPoolClient({
    userPoolClientNameId: CognitoUsersPoolClientNames.CommonUsersPoolCli,
    userPoolNameId: CognitoUsersPoolNames.CommonUsersPool,
  });
};
