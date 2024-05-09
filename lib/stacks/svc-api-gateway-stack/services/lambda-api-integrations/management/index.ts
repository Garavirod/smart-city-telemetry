

export class SvcApiGatewayInstanceStack {
  private static _instance: SvcApiGatewayInstanceStack;
  public scope: any;


  private constructor() {}

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public initConfiguration(scope: any) {
    this.scope = scope;
  }
}
