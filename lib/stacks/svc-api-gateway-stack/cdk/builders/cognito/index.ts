import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import {
  CognitoUsersPoolClientNames,
  CognitoUsersPoolNames,
} from "../../../../shared/enums/cognito";
import { ApiGatewayStack } from "../../../stack";
import { CognitoCDKBuilder } from "../../../../../libs/cdk-builders/cognito";

export const createCognitoPools = (stack: ApiGatewayStack) => {
  // USER POOLS
  let cognitoUserPools: Record<string, UserPool> = {
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
  const cognitoUserPoolClients: Record<string, UserPoolClient> = {
    [CognitoUsersPoolClientNames.ManagementUsersPoolCli]:
      CognitoCDKBuilder.addCognitoUserPoolClient({
        scope: stack,
        userPoolClientNameId:
          CognitoUsersPoolClientNames.ManagementUsersPoolCli,
        userPool: cognitoUserPools[CognitoUsersPoolNames.ManagementUsersPool],
      }),
  };

  return {
    cognitoUserPools,
    cognitoUserPoolClients,
  };
};
