import { ServiceIdEvent } from "../../api/events/events";
import { ApiHandler, HttResponses } from "../../api/utils";

interface HandlerEvent extends ServiceIdEvent {}
export const handler = ApiHandler.apiHandler<HandlerEvent>(async (event) => {
    const users = [{
        'user_id': 1111,
        'name': 'Rodrigo García',
        'dependency': event.service_id
    }]
    return HttResponses.ModelResponse(users);
})