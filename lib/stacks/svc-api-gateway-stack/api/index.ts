import { GeneralApiGateway } from "./general-apigw";
import { createAllAPIResources } from "./resources";

export const createAPIGatewayServices = (scope: any) => {
  GeneralApiGateway.Instance.initConfiguration(scope);
  createAllAPIResources();
};
