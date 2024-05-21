import * as TJS from "typescript-json-schema";
import * as path from "path";
import { Logger } from "../../../../../../libs/logger";

type generateSchemaModelOptions = {
  modelsFileName: string;
  interfaceName: string;
  directoryToSaveSchema: string;
};

type schemaModelGenerationOptions = {
  interfaceName: string;
};

const generateSchemaModel = (options: generateSchemaModelOptions) => {
  // Settings for the schema generator
  const settings: TJS.PartialArgs = {
    required: true,
  };

  // Interface models file
  const program = TJS.getProgramFromFiles([
    path.join(__dirname, `../${options.modelsFileName}`),
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

export const SchemaModelBuilder = {
  management: (options: schemaModelGenerationOptions) =>
    generateSchemaModel({
      interfaceName: options.interfaceName,
      modelsFileName: "management.ts",
      directoryToSaveSchema: "management",
    }),
};
