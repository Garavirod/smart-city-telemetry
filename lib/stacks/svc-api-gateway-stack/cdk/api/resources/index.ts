import { GeneralApiGateway } from "../general-apigw";
import { manageMentResources } from "./management/resources";


/**
 * This function creates the api resource from the root.
 * as follows:
 * root
 *  management/
 *             nested resources..
 *  tren-ligero/
 *              nested resources..
 */
export const createAllAPIResources = () => {
  // Management resources
  GeneralApiGateway.Instance.addApiResourceFromRoot(manageMentResources);
};
