import { Topic } from "aws-cdk-lib/aws-sns";
import { Construct } from "constructs";
import { createResourceNameId } from "../../../stacks/shared/utils/rename-resource-id";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { SqsSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

type createTopicOptions = {
  nameId: string;
  scope: Construct;
};

type queueSubscriptionOptions = {
  queues: Queue[];
  topic: Topic;
};


export function createTopic(options: createTopicOptions) {
  return new Topic(options.scope, createResourceNameId(options.nameId), {
    displayName: `${options.nameId} topic`,
  });
}

export function addQueSubscription(options: queueSubscriptionOptions) {
  for (let i = 0; i < options.queues.length; i++) {
    const subscription = new SqsSubscription(options.queues[i]);
    options.topic.addSubscription(subscription);
  }
}
