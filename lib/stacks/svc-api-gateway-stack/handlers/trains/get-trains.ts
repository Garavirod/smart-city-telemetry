/* import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  ParamPropertyType,
  extractDataFromEvent,
} from "../../utils/pre-process-event";
import {
  InternalErrorResponse500,
  SuccessResponse200,
  UnprocessableRequestResponse403,
} from "../../utils/api-response";
import { Logger } from "../../../../../libs/logger";
import { UsersModel } from "../../../../../libs/clients/dynamodb/models/management";
import { ManagementDynamoService } from "../../../../../libs/clients/dynamodb/services";
import { v4 as uuidv4 } from "uuid";
import { ManagementCognitoService } from "../../../../../libs/clients/cognito/services";
import { GlobalEnvironmentVars } from "../../../../../libs/environment";
import { UsernameExistsException } from "@aws-sdk/client-cognito-identity-provider";
import { TrainCoordsModel } from "../../../cdk/builders/api/models/trains";
import { TrainModel } from "../../../../../libs/clients/dynamodb/models/train";
import { ApiGWMntNotificationService } from "../../../../../libs/clients/api-gateway-management/services";

interface BodyParamsExpected extends TrainCoordsModel {}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const params = <BodyParamsExpected>extractDataFromEvent({
    event: event,
    propertyToExtract: ParamPropertyType.Body,
  });
  try {
    const train: TrainModel = {
      trainId: params.trainId,
      velocity: params.velocity,
      coords: params.coords,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await ApiGWMntNotificationService.notifyTrainLocation({
      
    })



    return SuccessResponse200({});
  } catch (error) {
    Logger.error(`Handler error ${JSON.stringify(error)}`);

    return InternalErrorResponse500({});
  }
};

 */