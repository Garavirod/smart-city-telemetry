#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { SvcApiGatewayStack } from "../lib/stacks/svc-api-gateway-stack";
import { SvcPermissionsStack } from "../lib/stacks/svc-permissions-stack";

const app = new cdk.App();

// Stacks creation
// new SvcPermissionsStack(app, "svc-permissions-stack",{});
new SvcApiGatewayStack(app, "SvcApiGateway", {});
