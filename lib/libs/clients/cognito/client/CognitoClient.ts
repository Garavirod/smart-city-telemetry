import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

export class CognitoClientInstance {
  private client: CognitoIdentityProviderClient;
  constructor() {
    this.client = new CognitoIdentityProviderClient({});
  }

  public get getClient() {
    return this.client;
  }
}
