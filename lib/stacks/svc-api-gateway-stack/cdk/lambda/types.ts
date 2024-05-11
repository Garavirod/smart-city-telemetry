export enum ManagementLambdaKeyNames {
  GetUsers = "get-users",
  GetDependencies = "get-dependencies",
}

export enum TrenLigeroLambdaKeyNames {
  GetTrenes = "get-trenes",
}

export type LambdasKeyNames =
  | ManagementLambdaKeyNames
  | TrenLigeroLambdaKeyNames;
