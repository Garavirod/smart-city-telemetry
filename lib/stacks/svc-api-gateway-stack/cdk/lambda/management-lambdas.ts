import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import path = require("path");
import { LambdasKeyNames, ManagementLambdaKeyNames } from "./types";
import { overrideLogicalResourceName } from "../helpers/override-logical-resource-name";

export class ManagementLambdas {
  private scope: Construct;
  private lambdaHandlers: Record<LambdasKeyNames, NodejsFunction>;

  constructor(scope: Construct) {
    this.lambdaHandlers = { ...this.lambdaHandlers };
    this.scope = scope;
    this.createLambdas();
    this.overrideLogicalNameResources();
  }

  /**
   * Create all the lambda definitions
   */
  private createLambdas() {
    this.getLambdaHandlers[ManagementLambdaKeyNames.GetUsers] =
      this.createNodeFunctionLambda({
        fileNameImlCode: "get-users.ts",
        lambdaName: ManagementLambdaKeyNames.GetUsers,
        environment: {},
      });

    this.getLambdaHandlers[ManagementLambdaKeyNames.GetDependencies] =
      this.createNodeFunctionLambda({
        fileNameImlCode: "get-dependencies.ts",
        lambdaName: ManagementLambdaKeyNames.GetDependencies,
        environment: {},
      });
  }

  private overrideLogicalNameResources() {
    for (const k in this.lambdaHandlers) {
      overrideLogicalResourceName({
        resource: this.getLambdaHandlers[k as LambdasKeyNames],
      });
    }
  }

  /**
   * Returns the map with all the lambdas defined
   */
  public get getLambdaHandlers() {
    return this.lambdaHandlers;
  }

  /**
   * Creates an instance of NodejsFunction for creating a lambda
   * handler
   * @param props
   * @returns {NodejsFunction}
   */
  private createNodeFunctionLambda(props: {
    lambdaName: string;
    fileNameImlCode: string;
    environment: Record<string, string>;
  }) {
    const { lambdaName, fileNameImlCode, environment } = props;
    return new NodejsFunction(this.scope, lambdaName, {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: path.join(
        __dirname,
        `../../services/lambda-api-integrations/management/${fileNameImlCode}`
      ),
      environment,
    });
  }
}
