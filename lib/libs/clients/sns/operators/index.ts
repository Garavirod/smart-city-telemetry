import { PublishCommand, PublishInput } from "@aws-sdk/client-sns";
import { Logger } from "../../../logger";
import { SnsClientInstance } from "../client/sns-client";

type snsPublishMessage = {
  topicArn: string;
  dataMessage: any;
};
export const PublishCommandOperator = async (options: snsPublishMessage) => {
  Logger.debug(`options > ${JSON.stringify(options)}`);
  const client = new SnsClientInstance();
  const input: PublishInput = {
    TargetArn: options.topicArn,
    Message: JSON.stringify(options.dataMessage),
  };
  const command = new PublishCommand(input);
  const response = await client.getClient.send(command);
  Logger.debug(`Message successfully published! ${JSON.stringify(response)}`);
};
