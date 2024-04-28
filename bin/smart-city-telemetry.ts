#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TrustGHActionsStack } from '../lib/stacks/trust-gh-actions/stack';
import { APIGatewayStack } from '../lib/stacks/api/stack';


const app = new cdk.App();

// Stacks creation
new TrustGHActionsStack(app, "TrustGHActionsStack",{});
//new APIGatewayStack(app, "APIGatewayStack",{});
