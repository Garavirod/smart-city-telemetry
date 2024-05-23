import { Logger } from "../../../logger";
import { UserRole } from "../../dynamodb/models/management";
import { CognitoEnvValues } from "../../environment";
import { SignupUserCommandOperation } from "../operations/cognito-operations";

type newUserCognitoServiceOptions = {
  password: string;
  userRole: UserRole;
  email: string;
};
export const signUp = async (options: newUserCognitoServiceOptions) => {
  try {
    await SignupUserCommandOperation({
      userName: options.email,
      password: options.password,
      userRole: options.userRole,
      userPoolClientId: CognitoEnvValues.USER_POOL_CLIENT_ID,
    });
  } catch (error) {
    Logger.error(`Error on creating new user via service ${error}`);
    throw Error(`${error}`);
  }
};
