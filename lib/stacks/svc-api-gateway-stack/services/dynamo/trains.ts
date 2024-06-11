import { PutCommandOperation } from "../../../../libs/clients/dynamodb/operations/dynamo-operations";
import { Logger } from "../../../../libs/logger";
import { TrainCoordsModel } from "../../cdk/builders/api/models/trains";
import { DynamoEnvTables } from "../env";

export const updateOrCreateTrainLocation = async (item: TrainCoordsModel) => {
  try {
    const table = DynamoEnvTables.TRAINS_TABLE;
    await PutCommandOperation({
      TableName: table,
      Item: item,
    });
  } catch (error) {
    Logger.error(`Error on putting train data via service ${error}`);
    throw error;
  }
};
