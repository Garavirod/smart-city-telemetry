import { SearchColumnTables } from "../tables/table-search-columns";
import { DynamoTables } from "../tables/tables";
import { TableIndex } from "../tables/tables-index";

export type PutOptions = {
  TableName: DynamoTables;
  Item: any;
};

export type GetOptions = {
  TableName: DynamoTables;
  key: any;
};

export type QueryPaginationOptions = {
  TableName: DynamoTables;
  searchOptions: SearchOptions<SearchColumnTables, TableIndex>;
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
