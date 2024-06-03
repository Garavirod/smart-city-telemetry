import {
  StringAttribute,
  UserPool,
  UserPoolClient,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { createResourceNameId } from "../../stacks/shared/utils/rename-resource-id";

type addUserPoolOptions = {
  userPoolNameId: string;
  customAttributes?: customAttributeOptions[];
};

type createUserPoolClientsOptions = {
  userPoolClientNameId: string;
  userPool: UserPool;
};

type customAttributeOptions = {
  nameAttribute: string;
  mutable: boolean;
};
export class CognitoBuilder {
  private readonly scope: Construct;

  constructor(scope: Construct) {
    this.scope = scope;
  }

  public createUserPool(options: addUserPoolOptions) {
    return new UserPool(
      this.scope,
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
        customAttributes: this.setCustomAttributesToPoolId(
          options.customAttributes
        ),
      }
    );
  }

  private setCustomAttributesToPoolId(attributes?: customAttributeOptions[]) {
    if (!attributes) return attributes;

    let attributesResponse: Record<string, StringAttribute> = {};
    for (const att of attributes) {
      attributesResponse[att.nameAttribute] = new StringAttribute({
        mutable: att.mutable,
      });
    }
    return attributesResponse;
  }

  public addCognitoUserPoolClient(options: createUserPoolClientsOptions) {
    return new UserPoolClient(
      this.scope,
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
}
