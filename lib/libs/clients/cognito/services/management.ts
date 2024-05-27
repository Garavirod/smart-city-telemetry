import {
  CodeMismatchException,
  ExpiredCodeException,
  UsernameExistsException,
} from "@aws-sdk/client-cognito-identity-provider";
import { Logger } from "../../../logger";
import { UserRole } from "../../dynamodb/models/management";
import { CognitoEnvValues } from "../../environment";
import {
  ConfirmationCodeCommandOperation,
  ResendConfirmationCodeCommandOperation,
  SignInCommandOperation,
  SignupUserCommandOperation,
} from "../operations/cognito-operations";

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
    if (error instanceof UsernameExistsException) {
      throw UsernameExistsException;
    }
    throw Error(`Error on signUp user via service ${error}`);
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
    return response.AuthenticationResult?.IdToken;
  } catch (error) {
    Logger.error(`Error on SignIn user via service ${error}`);
    throw Error(`${error}`);
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
    if (error instanceof ExpiredCodeException) throw ExpiredCodeException;
    if (error instanceof CodeMismatchException) throw CodeMismatchException;
    throw Error(`${error}`);
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
    throw Error(`${error}`);
  }
};
