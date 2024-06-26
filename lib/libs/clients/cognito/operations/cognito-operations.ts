import {
  SignUpRequest,
  SignUpCommand,
  InitiateAuthCommand,
  InitiateAuthRequest,
  AuthFlowType,
  ConfirmSignUpCommandInput,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  ResendConfirmationCodeCommandInput,
  GlobalSignOutCommand,
  GlobalSignOutCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import { CognitoClientInstance } from "../client/CognitoClient";
import {
  confirmationCodeOptions,
  createAdminUserCognitoOptions,
  resendConfirmationCodeOptions,
  signInOptions,
  signOutOptions,
} from "./types";
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

export const SignInCommandOperation = async (options: signInOptions) => {
  const cognitoClient = new CognitoClientInstance();

  const input: InitiateAuthRequest = {
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: options.userPoolClientId,
    AuthParameters: {
      USERNAME: options.email,
      PASSWORD: options.password,
    },
  };

  Logger.debug(`SignIn User Input >: ${JSON.stringify(input)}`);

  const command = new InitiateAuthCommand(input);
  const response = await cognitoClient.getClient.send(command);

  Logger.debug(
    `SignIn User successfully done >: ${JSON.stringify(response.$metadata)}`
  );

  return response;
};

export const SignOutCommandOperation = async (options: signOutOptions) => {
  const cognitoClient = new CognitoClientInstance();

  const input: GlobalSignOutCommandInput = {
    AccessToken: options.token,
  };

  Logger.debug(`SignOut User Input >: ${JSON.stringify(input)}`);

  const command = new GlobalSignOutCommand(input);
  const response = await cognitoClient.getClient.send(command);

  Logger.debug(
    `SignOut User successfully done >: ${JSON.stringify(response.$metadata)}`
  );
};

export const ConfirmationCodeCommandOperation = async (
  options: confirmationCodeOptions
) => {
  const cognitoClient = new CognitoClientInstance();

  const input: ConfirmSignUpCommandInput = {
    ClientId: options.userPoolClientId,
    Username: options.email,
    ConfirmationCode: options.code,
  };

  Logger.debug(`ConfirmationCodeCommand Input >: ${JSON.stringify(input)}`);

  const command = new ConfirmSignUpCommand(input);
  const response = await cognitoClient.getClient.send(command);

  Logger.debug(
    `Confirmation code successfully done >: ${JSON.stringify(
      response.$metadata
    )}`
  );
};

export const ResendConfirmationCodeCommandOperation = async (
  options: resendConfirmationCodeOptions
) => {
  const cognitoClient = new CognitoClientInstance();

  const input: ResendConfirmationCodeCommandInput = {
    ClientId: options.userPoolClientId,
    Username: options.email,
  };

  Logger.debug(
    `ResendConfirmationCodeCommand Input >: ${JSON.stringify(input)}`
  );

  const command = new ResendConfirmationCodeCommand(input);
  const response = await cognitoClient.getClient.send(command);

  Logger.debug(
    `Re-send confirmation code successfully done >: ${JSON.stringify(
      response.$metadata
    )}`
  );

  return response;
};
