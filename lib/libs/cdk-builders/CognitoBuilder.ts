import {
  StringAttribute,
  UserPool,
  UserPoolClient,
  UserPoolOperation,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import { createResourceNameId } from "../../stacks/shared/utils/rename-resource-id";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { GlobalEnvironmentVars } from "../environment";
import { Logger } from "../logger";

type createUserPoolOptions = {
  userPoolNameId: string;
  customAttributes?: customAttributeOptions[];
};

type createUserPoolClientsOptions = {
  userPoolClientNameId: string;
  userPoolNameId: string;
};

type lambdaPermissionCognitoUsersOptions = {
  lambdaFunctions: NodejsFunction[];
  userPoolNameId: string;
};

type customAttributeOptions = {
  nameAttribute: string;
  mutable: boolean;
};

type preSignupLambdaTriggerOptions = {
  lambdaFunction: NodejsFunction;
  userPoolNameId: string;
};
export class CognitoBuilder {
  private readonly scope: Construct;
  private userPools: Record<string, UserPool>;
  private userPoolClients: Record<string, UserPoolClient>;

  constructor(scope: Construct) {
    this.scope = scope;
    this.userPools = {};
    this.userPoolClients = {};
  }

  public createUserPool(options: createUserPoolOptions) {
    this.userPools[options.userPoolNameId] = new UserPool(
      this.scope,
      createResourceNameId(options.userPoolNameId),
      {
        selfSignUpEnabled: true,
        signInAliases: { email: true },
        autoVerify: { email: true },
        standardAttributes: {
          email: {
            required: true,
            mutable: false,
          },
        },
        customAttributes: this.setCustomAttributesToPoolId(
          options.customAttributes
        ),
      }
    );
  }

  /**
   * This method only must be used on Dev or Qa environments
   * @param options
   */
  public addPreSignupLambdaTrigger(options: preSignupLambdaTriggerOptions) {
    if (GlobalEnvironmentVars.DEPLOY_ENVIRONMENT !== "Prod") {
      this.userPools[options.userPoolNameId].addTrigger(
        UserPoolOperation.PRE_SIGN_UP,
        options.lambdaFunction
      );
    } else {
      Logger.warn(
        `Deploy environment value ${GlobalEnvironmentVars.DEPLOY_ENVIRONMENT}`
      );
    }
  }

  private setCustomAttributesToPoolId(attributes?: customAttributeOptions[]) {
    if (!attributes) return attributes;

    let attributesResponse: Record<string, StringAttribute> = {};
    for (const att of attributes) {
      attributesResponse[att.nameAttribute] = new StringAttribute({
        mutable: att.mutable,
      });
    }
    return attributesResponse;
  }

  public createCognitoUserPoolClient(options: createUserPoolClientsOptions) {
    this.userPoolClients[options.userPoolClientNameId] = new UserPoolClient(
      this.scope,
      createResourceNameId(options.userPoolClientNameId),
      {
        userPool: this.userPools[options.userPoolNameId],
        generateSecret: false,
        authFlows: {
          userPassword: true, // This enables the USER_PASSWORD_AUTH flow
        },
      }
    );
  }

  /**
   * Grant the Lambda function permissions to sign up users in Cognito
   * @param options {lambdaPermissionCognitoUsersOptions}
   */
  public grantLambdasCreateUsersPermission(
    options: lambdaPermissionCognitoUsersOptions
  ) {
    for (let i = 0; i < options.lambdaFunctions.length; i++) {
      options.lambdaFunctions[i].addToRolePolicy(
        new PolicyStatement({
          actions: ["cognito-idp:SignUp"],
          resources: [this.userPools[options.userPoolNameId].userPoolArn],
        })
      );
    }
  }

  /**
   * Grant the Lambda function permissions to sign In users in Cognito
   * @param options {lambdaPermissionCognitoUsersOptions}
   */
  public grantLambdasSignInUsersPermission(
    options: lambdaPermissionCognitoUsersOptions
  ) {
    for (let i = 0; i < options.lambdaFunctions.length; i++) {
      options.lambdaFunctions[i].addToRolePolicy(
        new PolicyStatement({
          actions: ["cognito-idp:InitiateAuth"],
          resources: [this.userPools[options.userPoolNameId].userPoolArn],
        })
      );
    }
  }

  public get getCognitoClients() {
    return this.userPoolClients;
  }

  public get getCognitoPools() {
    return this.userPools;
  }
}
