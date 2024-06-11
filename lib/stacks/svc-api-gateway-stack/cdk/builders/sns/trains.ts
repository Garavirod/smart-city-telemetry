import { Stack } from "aws-cdk-lib"
import { SnsCDKBuilder } from "../../../../../libs/cdk-builders/sns"
import { SnsTopicNames } from "../../../../shared/enums/sns"
import { SnsTopics } from "../../../../shared/types"


export const createTrainTopics = (stack:Stack) => {
    const topics: SnsTopics = {
        [SnsTopicNames.NotifyTrainLocationTopic]: SnsCDKBuilder.createTopic({
            scope: stack,
            nameId: SnsTopicNames.NotifyTrainLocationTopic
        })
    }

    return topics;
}