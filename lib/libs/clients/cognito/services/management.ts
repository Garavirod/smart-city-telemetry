import { Logger } from "../../../logger";
import { UserRole } from "../../dynamodb/models/management";
import { CognitoEnvValues } from "../../environment";
import {
  SignInCommand,
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

export const signUp = async (options: newUserCognitoServiceOptions) => {
  try {
    const poolClient =
      options.userRole === UserRole.AdminUser
        ? CognitoEnvValues.USER_POOL_MANAGEMENT_CLIENT_ID
        : CognitoEnvValues.USER_POOL_COMMON_CLIENT_ID;
    await SignupUserCommandOperation({
      userName: options.email,
      password: options.password,
      userRole: options.userRole,
      userPoolClientId: poolClient,
    });
  } catch (error) {
    Logger.error(`Error on creating new user via service ${error}`);
    throw Error(`${error}`);
  }
};

export const signIn = async (options: signInOptions) => {
  try {
    const poolClient =
      options.role === UserRole.AdminUser
        ? CognitoEnvValues.USER_POOL_MANAGEMENT_CLIENT_ID
        : CognitoEnvValues.USER_POOL_COMMON_CLIENT_ID;
    await SignInCommand({
      email: options.email,
      password: options.password,
      userPoolClientId: poolClient,
    });
  } catch (error) {
    Logger.error(`Error on creating new user via service ${error}`);
    throw Error(`${error}`);
  }
};
