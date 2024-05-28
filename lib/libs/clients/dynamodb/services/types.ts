export type PaginationServiceResponse<T> = {
  data: T[];
  nextPage: string | undefined;
  count: number;
};

export type UsersTableColumnSearch = "email" | "UserId";
