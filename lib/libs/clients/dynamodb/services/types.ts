export type PaginationServiceResponse<T> = {
  data: T[];
  nextPage: string | undefined;
  count: number;
};

export enum UsersTableIndex {
  "EmailICreatedAtIndex" = "email-createdAt-index",
}

export type UsersTableColumnSearch = "email" | "UserId";
