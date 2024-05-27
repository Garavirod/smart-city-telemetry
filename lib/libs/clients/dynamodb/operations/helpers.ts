import {
  FilterExpressionConjunctions,
  SearchExpression,
  UpdateExpression,
} from "./types";

export const toExpressionAttributeNames = <T>(
  expressions: Array<SearchExpression<T>> | UpdateExpression[]
) => {
  const names: Record<string, any> = {};
  expressions.forEach(({ column }) => (names[`#${column}`] = column));
  return names;
};

export const toExpressionAttributeValues = <T>(
  expressions: Array<SearchExpression<T>>
) => {
  const values: Record<string, any> = {};
  const repeatedColumns: Record<string, any> = {};
  expressions.forEach(({ column, value, operator }) => {
    if (`${column}` in repeatedColumns) {
      if (operator === "between" && Array.isArray(value)) {
        values[`:${column}_${repeatedColumns[`${column}`] + 1}`] = value[0];
        values[`:${column}_${repeatedColumns[`${column}`] + 2}`] = value[1];
        repeatedColumns[`${column}`] += 2;
      } else {
        values[`:${column}_${repeatedColumns[`${column}`]}`] = value;
        repeatedColumns[`${column}`] += 1;
      }
    } else {
      if (operator === "between" && Array.isArray(value)) {
        values[`:${column}`] = value[0];
        values[`:${column}_1`] = value[1];
        repeatedColumns[`${column}`] = 2;
      } else {
        values[`:${column}`] = value;
        repeatedColumns[`${column}`] = 1;
      }
    }
  });
  return values;
};
export const toFilterExpressions = <T>(
  expressions: Array<SearchExpression<T>>,
  conjunction: FilterExpressionConjunctions = "AND"
) => {
  const repeatedColumns: Record<string, any> = {};
  return expressions
    .map(({ column, operator, value }) => {
      let expression: string;
      if (`${column}` in repeatedColumns) {
        if (operator === "between" && Array.isArray(value)) {
          // #example BETWEEN :example_value_1 AND :example_value_2
          expression = `#${column} BETWEEN :${column}_${
            repeatedColumns[`${column}`] + 1
          } AND :${column}_${repeatedColumns[`${column}`] + 2}`;
          repeatedColumns[`${column}`] += 1;
        } else {
          expression = `#${column} ${operator} :${column}_${
            repeatedColumns[`${column}`]
          }`;
          repeatedColumns[`${column}`] += 1;
        }
      } else {
        if (operator === "between" && Array.isArray(value)) {
          // #example BETWEEN :example_value AND :example_value_1
          expression = `#${column} BETWEEN :${column} AND :${column}_1`;
          repeatedColumns[`${column}`] = 2;
        } else {
          expression = `#${column} ${operator} :${column}`;
          repeatedColumns[`${column}`] = 1;
        }
      }
      return expression;
    })
    .join(` ${conjunction} `);
};

export const toKeyConditionExpressions = <T>(
  expressions: Array<SearchExpression<T>>,
  conjunction: string = "AND"
) => {
  return expressions
    .map(({ column, operator }) => {
      if (operator === "between") {
        return `#${column} BETWEEN :${column} AND :${column}_1`;
      }
      return `#${column} ${operator} :${column}`;
    })
    .join(` ${conjunction} `);
};

// ! NOTE: This function only works with the begins_with operator on sort keys
export const toKeyConditionExpressionsBeginWith = <T>(
  expression: Array<SearchExpression<T>>
) => {
  return `#${expression[1].column} ${expression[1].operator} :${expression[1].column}
              AND
            begins_with(#${expression[0].column}, :${expression[0].column})`;
};

export const getUpdateExpressions = (
  expressions: Array<UpdateExpression>
) => {
  const attributeNames: Record<string, any> = {};
  const attributeValues: Record<string, any> = {};
  let updateExpressions:string[] = [];

  expressions.forEach(({ column, newValue }) => {
    attributeNames[`#${column}`] = column;
    attributeValues[`:${column}`] = `${newValue}`;
    updateExpressions.push(`#${column} = :${column}`);
  });
  const updateExpression = "SET "+updateExpressions.join(', ');
  return {
    attributeNames,
    attributeValues,
    updateExpression,
  };
};
