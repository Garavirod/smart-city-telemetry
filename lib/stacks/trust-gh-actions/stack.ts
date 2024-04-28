import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
export class TrustGHActionsStack extends cdk.Stack {
  private githubOrg: cdk.CfnParameter;
  private githubRepo: cdk.CfnParameter;
  private githubProvider: iam.CfnOIDCProvider;
  private githubActionsRole: iam.Role;
  private assumeCdkDeploymentRoles: iam.PolicyStatement;

  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);
    this.configureProvider();
    this.createIamRole();
    this.createPolicY();
  }

  private configureProvider() {
    this.githubOrg = new cdk.CfnParameter(this, "GithubOrg", {
      type: "String",
      description: "The GitHub organization that owns the repository.",
    });

    this.githubRepo = new cdk.CfnParameter(this, "GitHubRepo", {
      type: "String",
      description: "The GitHub repository that will run the action.",
    });

    this.githubProvider = new iam.CfnOIDCProvider(this, "GitHubOIDCProvider", {
      thumbprintList: ["6938fd4d98bab03faadb97b34396831e3780aea1"],
      url: "https://token.actions.githubusercontent.com", // <-- 1 per account
      clientIdList: ["sts.amazonaws.com"], // <-- Tokens are intended for STS
    });
  }

  private createIamRole() {
    this.githubActionsRole = new iam.Role(this, "GitHubActionsRole", {
      assumedBy: new iam.FederatedPrincipal(
        this.githubProvider.attrArn,
        {
          StringLike: {
            // This specifies that the subscriber (sub) claim must be the main
            // branch of your repository. You can use wildcards here, but
            // you should be careful about what you allow.
            "token.actions.githubusercontent.com:sub": [
              `repo:${this.githubOrg.valueAsString}/${this.githubRepo.valueAsString}:*`,
            ],
          },
          // This specifies that the audience (aud) claim must be sts.amazonaws.com
          StringEquals: {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          },
        },
        "sts:AssumeRoleWithWebIdentity" // <-- Allows use of OIDC identity
      ),
    });
  }

  private createPolicY() {
    // -- A policy to permit assumption of the default AWS CDK roles. --
    // Allows assuming roles tagged with an aws-cdk:bootstrap-role tag of
    // certain values (file-publishing, lookup, deploy) which permit the CDK
    // application to look up existing values, publish assets, and create
    // CloudFormation changesets. These roles are created by CDK's
    // bootstrapping process. See:
    // https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html
    //
    // WARNING: The CDK `deploy` role allows the CDK to execute changes via
    //          CloudFormation with its execution role. The execution role
    //          has full administrative permissions. It can only be assumed
    //          by CloudFormation, but you should still be aware.
    this.assumeCdkDeploymentRoles = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["sts:AssumeRole"],
      resources: [
        "arn:aws:iam::*:role/cdk-*",
        /*  "*" */
      ],
      conditions: {
        StringEquals: {
          "aws:ResourceTag/aws-cdk:bootstrap-role": [
            "file-publishing",
            "lookup",
            "deploy",
          ],
        },
      },
    });

    // Attach policy to role
    this.githubActionsRole.addToPolicy(this.assumeCdkDeploymentRoles);
    this.githubActionsRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "AWSCloudFormationReadOnlyAccess"
      )
    );

    new cdk.CfnOutput(this, "GitHubActionsRoleArn", {
      value: this.githubActionsRole.roleArn,
      description: "The role ARN for GitHub Actions to use during deployment.",
    });
  }
}
