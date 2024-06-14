import { Logger } from "../../../../libs/logger";
import { UserRole } from "../../../../libs/clients/dynamodb/models/management";
import {
  ConfirmationCodeCommandOperation,
  ResendConfirmationCodeCommandOperation,
  SignInCommandOperation,
  SignOutCommandOperation,
  SignupUserCommandOperation,
} from "../../../../libs/clients/cognito/operations/cognito-operations";
import { CognitoEnvValues } from "../env";

type newUserCognitoServiceOptions = {
  password: string;
  userRole: UserRole;
  email: string;
};

type signInOptions = {
  role: UserRole;
  password: string;
  email: string;
};

type verificationCodeOptions = {
  email: string;
  code: string;
};

export const signUp = async (options: newUserCognitoServiceOptions) => {
  try {
    const poolClient = CognitoEnvValues.USER_POOL_MANAGEMENT_CLIENT_ID;
    const input = {
      userName: options.email,
      password: options.password,
      userRole: options.userRole,
      userPoolClientId: poolClient,
    };
    await SignupUserCommandOperation(input);
  } catch (error) {
    Logger.error(`Error on signUp user via service ${error}`);
    throw error;
  }
};

export const signIn = async (options: signInOptions) => {
  try {
    const poolClient = CognitoEnvValues.USER_POOL_MANAGEMENT_CLIENT_ID;
    const input = {
      email: options.email,
      password: options.password,
      userPoolClientId: poolClient,
    };
    const response = await SignInCommandOperation(input);
    return {
      accessToken: response.AuthenticationResult?.AccessToken,
      idToken: response.AuthenticationResult?.IdToken,
      refreshToken: response.AuthenticationResult?.RefreshToken,
    };
  } catch (error) {
    Logger.error(`Error on SignIn user via service ${error}`);
    throw error;
  }
};

export const VerificationCode = async (options: verificationCodeOptions) => {
  try {
    const poolClient = CognitoEnvValues.USER_POOL_MANAGEMENT_CLIENT_ID;
    await ConfirmationCodeCommandOperation({
      userPoolClientId: poolClient,
      email: options.email,
      code: options.code,
    });
  } catch (error) {
    Logger.error(`Error on VerificationCode via service ${error}`);
    throw error;
  }
};

export const regenerateVerificationCode = async (email: string) => {
  try {
    const poolClient = CognitoEnvValues.USER_POOL_MANAGEMENT_CLIENT_ID;
    const response = await ResendConfirmationCodeCommandOperation({
      email: email,
      userPoolClientId: poolClient,
    });
    Logger.debug(
      `Code send successfully to ${response.CodeDeliveryDetails?.Destination}`
    );
  } catch (error) {
    Logger.error(`Error on regenerateVerificationCode via service ${error}`);
    throw error;
  }
};

export const signOut = async (token: string) => {
  try {
    await SignOutCommandOperation({ token });
  } catch (error) {
    Logger.error(`Error on sign out user via service ${error}`);
    throw error;
  }
};
