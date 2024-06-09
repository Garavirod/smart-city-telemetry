import { generateSchemaModel } from "../../../../../../shared/utils/generate-api-schemas-model";

export const signInSchema = generateSchemaModel({
  modelsFileName: "users.ts",
  interfaceName: "SignInUserModel",
});

export const signUpSchema = generateSchemaModel({
  modelsFileName: "users.ts",
  interfaceName: "SignupUsersModel",
});

export const verificationCodeSchema = generateSchemaModel({
  modelsFileName: "users.ts",
  interfaceName: "VerificationCodeModel",
});

export const EmailSchema = generateSchemaModel({
  modelsFileName: "users.ts",
  interfaceName: "EmailModel",
});
