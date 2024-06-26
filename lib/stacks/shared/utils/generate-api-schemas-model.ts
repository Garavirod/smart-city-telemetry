import * as TJS from "typescript-json-schema";
import * as path from "path";
import { Logger } from "../../../libs/logger";

type generateSchemaModelOptions = {
  modelsFileName: string;
  interfaceName: string;
};

type schemaModelGenerationOptions = {
  interfaceName: string;
};

export const generateSchemaModel = (options: generateSchemaModelOptions) => {
  // Settings for the schema generator
  const settings: TJS.PartialArgs = {
    required: true,
  };

  // Interface models file
  const program = TJS.getProgramFromFiles([
    path.join(
      __dirname,
      `../../svc-api-gateway-stack/cdk/builders/api/models/${options.modelsFileName}`
    ),
  ]);

  // We can either get the schema for one file and one type...
  const schema = TJS.generateSchema(program, options.interfaceName, settings);

  if (!schema) {
    Logger.error("Schema generation failed");
    throw Error(
      `Error on generating schema json file for ${options.interfaceName}`
    );
  }
  return schema;
};
