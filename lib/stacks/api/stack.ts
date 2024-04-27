import { GeneralApiGateway } from "./general-apigw";
import { createAllAPIResources } from "./resources";


export class APIGatewayStack {
  private scope: any;
  constructor(scope: any) {
    this.scope = scope;
  }

  public createStack() {
    GeneralApiGateway.Instance.initConfiguration(this.scope);
    createAllAPIResources();
  }
}
