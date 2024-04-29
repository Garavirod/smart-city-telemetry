import { createManagementResources } from "./management";
import { createTrenLigeroResources } from "./tren-ligero";

export const createAllAPIResources = () => {
    createManagementResources();
    createTrenLigeroResources();
}