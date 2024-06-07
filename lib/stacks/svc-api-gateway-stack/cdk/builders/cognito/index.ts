import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import {
  CognitoUsersPoolClientNames,
  CognitoUsersPoolNames,
} from "../../../../shared/enums/cognito";
import { CognitoCDKBuilder } from "../../../../../libs/cdk-builders/cognito";
import { Stack } from "aws-cdk-lib";

export const createCognitoPools = (stack: Stack) => {
  // USER POOLS
  let userPools: Record<string, UserPool> = {
    [CognitoUsersPoolNames.ManagementUsersPool]:
      CognitoCDKBuilder.createUserPool({
        scope: stack,
        userPoolNameId: CognitoUsersPoolNames.ManagementUsersPool,
        customAttributes: [
          {
            nameAttribute: "role",
            mutable: true,
          },
        ],
      }),
  };

  // USER POOL CLIENTS
  const userPoolClients: Record<string, UserPoolClient> = {
    [CognitoUsersPoolClientNames.ManagementUsersPoolCli]:
      CognitoCDKBuilder.addCognitoUserPoolClient({
        scope: stack,
        userPoolClientNameId:
          CognitoUsersPoolClientNames.ManagementUsersPoolCli,
        userPool: userPools[CognitoUsersPoolNames.ManagementUsersPool],
      }),
  };

  return {
    userPools,
    userPoolClients,
  };
};
