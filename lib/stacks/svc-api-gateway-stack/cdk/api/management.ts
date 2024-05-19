import { ApiRestBuilder } from "./ApiRestBuilder";
import { buildCorsConfigurations } from "./cors";
import { ResourcesAPI } from "./resources/types";

type buildApiRestConstructOptions = {
  builder: ApiRestBuilder;
  resources: ResourcesAPI;
};

export const buildApiRestConstructs = (
  options: buildApiRestConstructOptions
) => {
  const apiRestName = "TelemetryApi";

  options.builder.createApiRest({
    apiRestName,
    apiRestDescription: "General api rest fro telemetry app",
    apiStage: "dev",
    cors: buildCorsConfigurations(),
  });

  options.builder.configureExportStack("ApiGatewayUrl");
  options.builder.configureAPIKeyPlanUsage({
    name: "TelemetryAPiKey",
    description: `APi key usage for ${apiRestName}`,
  });

  options.builder.addApiResourceFromRoot({ resources: options.resources });
};
