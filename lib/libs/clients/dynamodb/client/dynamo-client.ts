import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  marshallOptions,
  unmarshallOptions,
} from "@aws-sdk/lib-dynamodb";
import { Logger } from "../../../logger";

export class DynamoClientInstance {
  private client: DynamoDBClient;
  private dynamoDocumentDBclient: DynamoDBDocumentClient;
  private marshallOptions: marshallOptions;
  private unmarshallOptions: unmarshallOptions;

  constructor() {
    //DynamoDBClient: Low-level, requires manual marshalling and unmarshalling.
    //DynamoDBDocumentClient: High-level, automatically handles marshalling and unmarshalling.
    this.client = new DynamoDBClient({});
    this.marshallOptions = {};
    this.unmarshallOptions = {};
    this.dynamoDocumentDBclient = DynamoDBDocumentClient.from(this.client, {
      unmarshallOptions: this.unmarshallOptions,
      marshallOptions: this.marshallOptions,
    });
  }

  /**
   * DynamoDBClient: Low-level, requires manual marshalling and unmarshalling.
   */
  public get getDynamoDBClient() {
    return this.client;
  }

  /**
   * DynamoDBDocumentClient: High-level, automatically handles marshalling and unmarshalling.
   */
  public get getDynamoDBDocumentClient() {
    return this.dynamoDocumentDBclient;
  }

  public destroyDynamoClients() {
    Logger.debug("Destroying dynamo client");
    this.dynamoDocumentDBclient.destroy();
    this.client.destroy();
  }
}
