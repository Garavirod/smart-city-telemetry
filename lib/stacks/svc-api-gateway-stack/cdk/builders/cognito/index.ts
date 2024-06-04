import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { CognitoBuilder } from "../../../../../libs/cdk-builders/CognitoBuilder";
import {
  CognitoUsersPoolClientNames,
  CognitoUsersPoolNames,
} from "../../../../shared/enums/cognito";
import { ApiGatewayStack } from "../../../stack";

export const runCognitoBuilder = (stack: ApiGatewayStack) => {
  const builder = new CognitoBuilder(stack);
  // USER POOLS
  let cognitoUserPools: Record<string, UserPool> = {
    [CognitoUsersPoolNames.ManagementUsersPool]: builder.createUserPool({
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
      builder.addCognitoUserPoolClient({
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
