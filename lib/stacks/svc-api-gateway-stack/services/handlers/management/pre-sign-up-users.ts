import { Context, Callback } from "aws-lambda";
import { Logger } from "../../../../../libs/logger";

interface CognitoUserPoolTriggerEvent {
  version: string;
  triggerSource: string;
  region: string;
  userPoolId: string;
  userName: string;
  callerContext: {
    awsSdkVersion: string;
    clientId: string;
  };
  request: {
    userAttributes: { [key: string]: string };
    validationData?: { [key: string]: string };
    clientMetadata?: { [key: string]: string };
  };
  response: {
    autoConfirmUser?: boolean;
    autoVerifyEmail?: boolean;
    autoVerifyPhone?: boolean;
  };
}

export const handler = async (
  event: CognitoUserPoolTriggerEvent,
  context: Context,
  callback: Callback
): Promise<CognitoUserPoolTriggerEvent> => {
  try {
    event.response.autoConfirmUser = true;
    event.response.autoVerifyEmail = true; // Optionally auto-verify email
    return event;
  } catch (error) {
    Logger.error(`Error on PreSignup > ${JSON.stringify(error)}`);
    throw Error(`Error on PreSignup`);
  }
};
