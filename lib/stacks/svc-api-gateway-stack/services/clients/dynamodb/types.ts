import { DynamoTables } from "./tables";

export interface marshallOptions {
  /**
   * Whether to automatically convert empty strings, blobs, and sets to `null`
   */
  convertEmptyValues?: boolean;
  /**
   * Whether to remove undefined values while marshalling.
   */
  removeUndefinedValues?: boolean;
  /**
   * Whether to convert typeof object to map attribute.
   */
  convertClassInstanceToMap?: boolean;
  /**
   * Whether to convert the top level container
   * if it is a map or list.
   *
   * Default is true when using the DynamoDBDocumentClient,
   * but false if directly using the marshall function (backwards compatibility).
   */
  convertTopLevelContainer?: boolean;
}

export interface unmarshallOptions {
  /**
   * Whether to return numbers as a string instead of converting them to native JavaScript numbers.
   * This allows for the safe round-trip transport of numbers of arbitrary size.
   */
  wrapNumbers?: boolean;

  /**
   * When true, skip wrapping the data in `{ M: data }` before converting.
   *
   * Default is true when using the DynamoDBDocumentClient,
   * but false if directly using the unmarshall function (backwards compatibility).
   */
  convertWithoutMapWrapper?: boolean;
}

export type PutOptions = {
  TableName: DynamoTables;
  Item: any;
};

export type GetOptions = {
  TableName: DynamoTables;
  key: any;
};
