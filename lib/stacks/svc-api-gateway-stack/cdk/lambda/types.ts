export enum ManagementLambdaKeyNames {
  GetUsers = "GetUsers",
  GetDependencies = "GetDependencies",
}

export enum TrenLigeroLambdaKeyNames {
  GetTrenes = "GetTrenes",
}

export type LambdasKeyNames =
  | ManagementLambdaKeyNames
  | TrenLigeroLambdaKeyNames;
