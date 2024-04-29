import { Construct } from "constructs";
import * as cdk from 'aws-cdk-lib';
import { GitHubActionsPermissions } from "./gihub-actions";


export class SvcPermissionsStack extends cdk.Stack{
  constructor(scope: Construct, id: string, props?: cdk.StackProps){
    super(scope, id, props);
    // Github actions
    new GitHubActionsPermissions(this);
  }
}
