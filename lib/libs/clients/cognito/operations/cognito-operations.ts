import {
  SignUpRequest,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoClientInstance } from "../client/CognitoClient";
import { createAdminUserCognitoOptions } from "./types";
import { Logger } from "../../../logger";

export const SignupUserCommandOperation = async (
  options: createAdminUserCognitoOptions
) => {
  const cognitoClient = new CognitoClientInstance();

  const input: SignUpRequest = {
    ClientId: options.userPoolClientId,
    Password: options.password,
    Username: options.userName,
    UserAttributes: [
      {
        Name: "custom:role",
        Value: options.userRole,
      },
      { Name: "email", Value: options.userName },
    ],
  };

  Logger.debug(`Signup User Input >: ${JSON.stringify(input)}`);

  const command = new SignUpCommand(input);
  const response = await cognitoClient.getClient.send(command);

  Logger.debug(
    `Signup User successfully done >: ${JSON.stringify(response.$metadata)}`
  );
};
