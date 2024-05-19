import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { createResourceNameId } from "../helpers";
import { GlobalEnvironmentVars } from "../../../../libs/environment";
import path = require("path");
import { Runtime } from "aws-cdk-lib/aws-lambda";

export class LambdaBuilder {
  private scope: Construct;
  private lambdaFunctions: Record<string, NodejsFunction>;
  constructor(scope: Construct) {
    this.scope = scope;
    this.lambdaFunctions = { ...this.lambdaFunctions };
  }

  /**
   * Creates an instance of NodejsFunction for creating a lambda
   * handler
   * @param props
   * @returns {NodejsFunction}
   */
  public createNodeFunctionLambda(props: {
    lambdaName: string;
    fileNameImlCode: string;
    environment: Record<string, string>;
  }) {
    const { lambdaName, fileNameImlCode, environment } = props;
    this.lambdaFunctions[lambdaName] = new NodejsFunction(
      this.scope,
      createResourceNameId(lambdaName),
      {
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        entry: path.join(
          __dirname,
          `../../services/lambda-api-integrations/management/${fileNameImlCode}`
        ),
        environment: {
          DEPLOY_ENVIRONMENT: GlobalEnvironmentVars.DEPLOY_ENVIRONMENT,
          LOGGER_LEVEL: GlobalEnvironmentVars.LOGGER_LEVEL,
          ...environment,
        },
      }
    );
  }

  public get getLambdaFunctions() {
    return this.lambdaFunctions;
  }
}
