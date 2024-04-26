import { ServiceIdEvent } from "../../api/events/events";
import { ApiHandler, HttResponses } from "../../api/utils";

interface HandlerEvent extends ServiceIdEvent {}
export const handler = ApiHandler.apiHandler<HandlerEvent>(async (event) => {
    const users = [{
        'dependency_id': 1111,
        'name': 'Tren ligero',
        'dependency': event.service_id
    }]
    return HttResponses.ModelResponse(users);
})