import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Logger } from "../../../../libs/logger";
import {
  InternalErrorResponse500,
  SuccessResponse200,
} from "../utils/api-response";
import { TrainCoordsModel } from "../../cdk/builders/api/models/trains";
import {
  ParamPropertyType,
  extractDataFromEvent,
} from "../utils/pre-process-event";
import { DynamoTrainsService } from "../../services/dynamo";

import { SnsService } from "../../services/sns";
interface BodyParamsExpected extends TrainCoordsModel {}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const params = <BodyParamsExpected>extractDataFromEvent({
      event: event,
      propertyToExtract: ParamPropertyType.Body,
    });

    const train: TrainCoordsModel = {
      coords: params.coords,
      trainId: params.trainId,
      velocity: params.velocity,
    };
    
    await DynamoTrainsService.updateOrCreateTrainLocation(train);

    await SnsService.publishTrainLocation(train);

    return SuccessResponse200({
      message: "Train location updated successfully",
    });
  } catch (error) {
    Logger.error(`Handler error ${JSON.stringify(error)}`);
    return InternalErrorResponse500({});
  }
};
