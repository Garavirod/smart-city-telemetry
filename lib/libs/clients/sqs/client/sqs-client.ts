import { SNSClient } from "@aws-sdk/client-sns";

export class SnsClientInstance {
  private client: SNSClient;
  constructor() {
    this.client = new SNSClient({});
  }

  public get getClient() {
    return this.client;
  }
}
