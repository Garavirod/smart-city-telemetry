#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { buildSvcApiGatewayStack } from "../lib/stacks/svc-api-gateway-stack";
import { buildSvcWebSocketApiStack } from "../lib/stacks/svc-web-scoket-api-stack";
/* import { SvcApiGatewayStack } from "../lib/stacks/svc-api-gateway-stack";
import { SvcPermissionsStack } from "../lib/stacks/svc-permissions-stack"; */

const app = new cdk.App();
buildSvcApiGatewayStack(app)
buildSvcWebSocketApiStack(app)
// Stacks creation
// new SvcPermissionsStack(app, "svc-permissions-stack",{});
/* new SvcApiGatewayStack(app, "SvcApiGateway", {}); */
