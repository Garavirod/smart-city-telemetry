import { Stack } from "aws-cdk-lib"
import { SnsCDKBuilder } from "../../../../../libs/cdk-builders/sns"
import { SnsTopicNames } from "../../../../shared/enums/sns"
import { SnsTopics } from "../../../../shared/types"


export const createUsersTopics = (stack:Stack) => {
    const topics: SnsTopics = {
        [SnsTopicNames.NotifyNewUserOnlineTopic]: SnsCDKBuilder.createTopic({
            scope: stack,
            nameId: SnsTopicNames.NotifyNewUserOnlineTopic
        })
    }


    return topics;
}