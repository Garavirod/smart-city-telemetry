import { SearchColumnTables } from "../tables/table-search-columns";

export type PutOptions = {
  TableName: string;
  Item: any;
};

export type GetOptions = {
  TableName: string;
  key: any;
};

export type UpdateOptions = {
  TableName: string;
  key: Record<string,any>;
  expressions: UpdateExpression[];
};

export type QueryPaginationOptions = {
  TableName: string;
  searchOptions: SearchOptions<string, string>;
  ScanIndexForward: boolean;
};

export type QueryPaginateResult<T> = {
  Items: T[];
  Count: number;
  IteratorDone?: boolean;
  LastEvaluatedKey?: string | undefined;
};

export type FilterExpressionConjunctions = "AND" | "OR";

export type SearchOperator =
  | "="
  | ">"
  | ">="
  | "<>"
  | "<"
  | "<="
  | "begins_with"
  | "between";

export interface SearchExpression<T> {
  column: T;
  operator: SearchOperator;
  value: string | number | string[] | number[] | boolean;
}

export interface UpdateExpression {
  column: string;
  newValue: string | number | string[] | number[] | boolean;
}

export interface PageOptions {
  pageSize: number;
  startingToken?: string;
}

export interface SearchOptions<TColumn, TableIndex> extends PageOptions {
  expressions: Array<SearchExpression<TColumn>>;
  filterExpressionAfterQueryDone?: Array<SearchExpression<TColumn>>;
  filterExpressionConjunction?: FilterExpressionConjunctions;
  index: TableIndex;
}

export interface SearchByIndexOptions {
  indexName: string;
}
