import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { createResourceNameId } from "../../stacks/svc-api-gateway-stack/cdk/helpers";
import { GlobalEnvironmentVars } from "../environment";
import path = require("path");
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { LambdasFunctionNames } from "../../stacks/svc-api-gateway-stack/cdk/lambda/types";

type createLambdaFunctionOptions = {
  lambdaName: LambdasFunctionNames;
  pathStackHandlerCode: string;
  environment: Record<string, string>;
};

export class LambdaBuilder {
  private scope: Construct;
  private lambdaFunctions: Record<LambdasFunctionNames, NodejsFunction>;
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
  public createNodeFunctionLambda(options: createLambdaFunctionOptions) {
    const { lambdaName, pathStackHandlerCode, environment } = options;
    this.lambdaFunctions[lambdaName] = new NodejsFunction(
      this.scope,
      createResourceNameId(lambdaName),
      {
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        entry: path.join(__dirname, `../../stacks/${pathStackHandlerCode}`),
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
