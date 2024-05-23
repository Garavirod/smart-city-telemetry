import { UserRole } from "../../dynamodb/models/management";

export type createAdminUserCognitoOptions = {
  userPoolClientId: string;
  userRole: UserRole;
  userName: string;
  password: string;
};
