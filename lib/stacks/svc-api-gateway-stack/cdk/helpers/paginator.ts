import { RequestParamType, RequestParameters } from "../api/resources/types";

/**
 * query string params pageSize and page. Both are required
 */
export const simplePaginationParams: RequestParameters[] = [
  {
    isRequired: true,
    sourceParamName: "pageSize",
    paramName: "pageSize",
    type: RequestParamType.QueryString,
  },
  {
    isRequired: true,
    sourceParamName: "page",
    paramName: "page",
    type: RequestParamType.QueryString,
  },
];
