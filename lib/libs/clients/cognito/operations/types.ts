import { UserRole } from "../../dynamodb/models/management";

export type createAdminUserCognitoOptions = {
  userPoolId: string;
  userRole: UserRole;
  userName: string;
  password: string;
};
