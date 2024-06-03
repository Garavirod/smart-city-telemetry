import { ApiGatewayManagementApiClient } from "@aws-sdk/client-apigatewaymanagementapi";

export class ApiGatewayManagementInstance {
  private client: ApiGatewayManagementApiClient;
  constructor(endpoint: string) {
    this.client = new ApiGatewayManagementApiClient({ endpoint });
  }

  public get getClient() {
    return this.client;
  }
}
