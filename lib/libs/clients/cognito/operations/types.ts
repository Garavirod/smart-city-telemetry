import { UserRole } from "../../dynamodb/models/management";

export type createAdminUserCognitoOptions = {
  userPoolClientId: string;
  userRole: UserRole;
  userName: string;
  password: string;
};

export type signInOptions = {
  password: string;
  email: string;
  userPoolClientId: string;
};

export type signOutOptions = {
  token: string;
};

export type confirmationCodeOptions = {
  userPoolClientId: string;
  email: string;
  code: string;
};

export type resendConfirmationCodeOptions = {
  userPoolClientId: string;
  email: string;
};
