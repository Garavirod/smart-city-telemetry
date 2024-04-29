import { createGETHttpMethods } from "./get"
import { createPOSTHttpMethods } from "./post";

export const createHttpMethods = () => {
    createGETHttpMethods();
    createPOSTHttpMethods();
}