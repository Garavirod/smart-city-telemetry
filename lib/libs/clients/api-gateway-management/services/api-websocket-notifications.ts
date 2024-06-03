import { Logger } from "../../../logger";
import { TrainModel } from "../../dynamodb/models/train";
import { WebSocketEnvValues } from "../../environment";
import { PostToConnectionCommandOperation } from "../operations";

type notifyTrainLocationOptions = {
  connectionId: string;
  data: TrainModel;
};
export const notifyTrainLocation = async (
  options: notifyTrainLocationOptions
) => {
  try {
    const endpoint = WebSocketEnvValues.WEBSOCKET_API_ENDPOINT;
    await PostToConnectionCommandOperation({
      connectionId: options.connectionId,
      data: options.data,
      endpoint,
    });
  } catch (error) {
    Logger.error(`Error on notifyNewUserSignedIn via service ${error}`);
    throw error;
  }
};
