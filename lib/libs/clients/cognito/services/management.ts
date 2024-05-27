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
    const poolClient = CognitoEnvValues.USER_POOL_MANAGEMENT_CLIENT_ID;
    const input = {
      userName: options.email,
      password: options.password,
      userRole: options.userRole,
      userPoolClientId: poolClient,
    };
    Logger.debug(`signUp input ${JSON.stringify(input)}`);
    await SignupUserCommandOperation(input);
  } catch (error) {
    Logger.error(`Error on signUp user via service ${error}`);
    throw Error(`${error}`);
  }
};

export const signIn = async (options: signInOptions) => {
  try {
    const poolClient = CognitoEnvValues.USER_POOL_MANAGEMENT_CLIENT_ID;
    const input = {
      email: options.email,
      password: options.password,
      userPoolClientId: poolClient
    };
    Logger.debug(`SignIn input ${JSON.stringify(input)}`);
    await SignInCommand(input);
  } catch (error) {
    Logger.error(`Error on SignIn user via service ${error}`);
    throw Error(`${error}`);
  }
};
