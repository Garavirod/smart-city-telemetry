import {
  StringAttribute,
  UserPool,
  UserPoolClient,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { createResourceNameId } from "../../../stacks/shared/utils/rename-resource-id";

type addUserPoolOptions = {
  scope: Construct;
  userPoolNameId: string;
  customAttributes?: customAttributeOptions[];
};

type createUserPoolClientsOptions = {
  scope: Construct;
  userPoolClientNameId: string;
  userPool: UserPool;
};

type customAttributeOptions = {
  nameAttribute: string;
  mutable: boolean;
};

export function createUserPool(options: addUserPoolOptions) {
  return new UserPool(
    options.scope,
    createResourceNameId(options.userPoolNameId),
    {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      standardAttributes: {
        email: {
          required: true,
          mutable: false,
        },
      },
      customAttributes: setCustomAttributesToPoolId(options.customAttributes),
    }
  );
}

function setCustomAttributesToPoolId(attributes?: customAttributeOptions[]) {
  if (!attributes) return attributes;

  let attributesResponse: Record<string, StringAttribute> = {};
  for (const att of attributes) {
    attributesResponse[att.nameAttribute] = new StringAttribute({
      mutable: att.mutable,
    });
  }
  return attributesResponse;
}

export function addCognitoUserPoolClient(
  options: createUserPoolClientsOptions
) {
  return new UserPoolClient(
    options.scope,
    createResourceNameId(options.userPoolClientNameId),
    {
      userPool: options.userPool,
      generateSecret: false,
      authFlows: {
        userPassword: true, // This enables the USER_PASSWORD_AUTH flow
      },
    }
  );
}
