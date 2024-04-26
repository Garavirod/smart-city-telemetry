import { APIManagementResourcesList } from "./management/types";
import { APITrenLigeroResources } from "./tren-ligero/types";

export type APiResources = APIManagementResourcesList | APITrenLigeroResources;