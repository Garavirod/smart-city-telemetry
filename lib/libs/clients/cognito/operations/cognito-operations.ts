import {
  AdminCreateUserCommand,
  AdminCreateUserRequest,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoClientInstance } from "../client/CognitoClient";
import { createAdminUserCognitoOptions } from "./types";
import { Logger } from "../../../logger";

export const AdminCreateUserCommandOperation = async (
  options: createAdminUserCognitoOptions
) => {
  const cognitoClient = new CognitoClientInstance();

  const input: AdminCreateUserRequest = {
    UserPoolId: options.userPoolId,
    TemporaryPassword: options.password,
    Username: options.userName,
    UserAttributes: [
      {
        Name: "UserRole",
        Value: options.userRole,
      },
    ],
  };

  Logger.debug(`CreateUser Input >: ${JSON.stringify(input)}`);

  const command = new AdminCreateUserCommand(input);
  const response = await cognitoClient.getClient.send(command);

  Logger.debug(
    `CreateUser successfully done >: ${JSON.stringify(response.$metadata)}`
  );
  Logger.debug(`userEnable >: ${JSON.stringify(response.User?.Enabled)}`);
  Logger.debug(`userStatus >: ${JSON.stringify(response.User?.UserStatus)}`);
  Logger.debug(`userName >: ${JSON.stringify(response.User?.Username)}`);
};
