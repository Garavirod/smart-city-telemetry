import { UsersModel } from "../../../../libs/clients/dynamodb/models/management";
import { PublishCommandOperator } from "../../../../libs/clients/sns/operators";
import { Logger } from "../../../../libs/logger";
import { TrainCoordsModel } from "../../cdk/builders/api/models/trains";
import { SnsTopicEnvs } from "../env";

export const publishNewUserOnline = async (user: UsersModel) => {
  try {
    const { userId, name, email, lastName, role, online } = user;
    await PublishCommandOperator({
      topicArn: SnsTopicEnvs.NOTIFY_USER_ONLINE_TOPIC_ARN,
      dataMessage: {
        userId,
        name,
        email,
        lastName,
        role,
        online,
      },
    });
  } catch (error) {
    Logger.error(`Error on publishNewUserOnline via service ${JSON.stringify(error)}`);
    throw error;
  }
};


export const publishTrainLocation = async (train: TrainCoordsModel) => {
  try {
    await PublishCommandOperator({
      topicArn: SnsTopicEnvs.NOTIFY_TRAIN_LOCATION_TOPIC_ARN,
      dataMessage: train
    });
  } catch (error) {
    Logger.error(`Error on publishTrainLocation via service ${JSON.stringify(error)}`);
    throw error;
  }
};
