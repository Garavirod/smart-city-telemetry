import { createHttpMethods } from "../../methods/management";
import { createResources } from "./resources";


export const createManagementResources = () => {
    createResources();
    createHttpMethods();
}





