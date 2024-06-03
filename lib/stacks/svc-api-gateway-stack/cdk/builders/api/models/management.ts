import {
  Dependencies,
  UserRole,
} from "../../../../../../libs/clients/dynamodb/models/management";

export interface SignupUsersModel {
  password: string;
  name: string;
  email: string;
  lastName: string;
  role: UserRole;
  visibleDependencies: Dependencies[];
}

export interface SignInUserModel {
  email: string;
  password: string;
}

export interface VerificationCodeModel {
  email: string;
  code: string;
}

export interface EmailModel {
  email: string;
}
