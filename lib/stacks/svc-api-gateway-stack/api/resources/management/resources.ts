import { GeneralApiGateway } from "../../general-apigw"
import { APIManagementResourcesList } from "./types";

export const createResources = () => {
    // Root
    GeneralApiGateway.Instance.addNewApiResource(APIManagementResourcesList.management);
    // Nested
    GeneralApiGateway.Instance.addResourceToResource({
        parentResource: APIManagementResourcesList.management,
        childResource: APIManagementResourcesList.users,
    });
    GeneralApiGateway.Instance.addResourceToResource({
        parentResource: APIManagementResourcesList.management,
        childResource: APIManagementResourcesList.dependencies,
    });

}
