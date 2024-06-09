import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import { createResourceNameId } from "../../../stacks/shared/utils/rename-resource-id";
import { Duration } from "aws-cdk-lib";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

type createSQSQueueOptions = {
  scope: Construct;
  nameId: string;
  deadLetterQueue?: {
    queue: Queue;
    maxReceiveCount: number;
  };
};
type createDQLQueueOptions = {
  scope: Construct;
  nameId: string;
};

type grantLambdaConsumePermissionsOptions = {
  queue: Queue;
  lambdas: NodejsFunction[];
};
export function createSQSQueue(options: createSQSQueueOptions) {
  return new Queue(options.scope, createResourceNameId(options.nameId), {
    visibilityTimeout: Duration.seconds(30),
    retentionPeriod: Duration.days(4),
    deadLetterQueue: options.deadLetterQueue,
  });
}

export function createDQLQueue(options: createDQLQueueOptions) {
  return new Queue(options.scope, createResourceNameId(options.nameId), {
    retentionPeriod: Duration.days(14),
  });
}

export function grantLambdasConsumePermissions(
  options: grantLambdaConsumePermissionsOptions
) {
  for (let i = 0; i < options.lambdas.length; i++) {
    options.queue.grantConsumeMessages(options.lambdas[i]);
  }
}
