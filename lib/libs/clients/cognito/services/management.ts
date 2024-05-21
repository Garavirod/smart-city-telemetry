import { Logger } from "../../../logger";
import { UserRole } from "../../dynamodb/models/management";
import { CognitoEnvValues } from "../../environment";
import { AdminCreateUserCommandOperation } from "../operations/cognito-operations";

type newUserCognitoServiceOptions = {
  password: string;
  userRole: UserRole;
  email: string;
};
export const createNewUser = async (options: newUserCognitoServiceOptions) => {
  try {
    await AdminCreateUserCommandOperation({
      userName: options.email,
      password: options.password,
      userRole: options.userRole,
      userPoolId: CognitoEnvValues.USER_POOL_ID,
    });
  } catch (error) {
    Logger.error(`Error on creating new user via service ${error}`);
    throw Error(`${error}`);
  }
};
