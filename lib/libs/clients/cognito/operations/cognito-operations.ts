import {
  SignUpRequest,
  SignUpCommand,
  InitiateAuthCommand,
  InitiateAuthRequest,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoClientInstance } from "../client/CognitoClient";
import { createAdminUserCognitoOptions, signInOptions } from "./types";
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

export const SignInCommand = async (options: signInOptions) => {
  const cognitoClient = new CognitoClientInstance();

  const input: InitiateAuthRequest = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: process.env.USER_POOL_CLIENT_ID!,
    AuthParameters: {
      USERNAME: options.email,
      PASSWORD: options.password,
    },
  };

  Logger.debug(`SignIn User Input >: ${JSON.stringify(input)}`);

  const command = new InitiateAuthCommand(input);
  const response = await cognitoClient.getClient.send(command);

  Logger.debug(
    `Signup User successfully done >: ${JSON.stringify(response.$metadata)}`
  );

  return response.AuthenticationResult?.IdToken;
};
