#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ApiGatewayStack } from "../lib/stacks/svc-api-gateway-stack/stack";
/* import { createStackSvcWebSocketApi } from "../lib/stacks/svc-web-scoket-api-stack"; */
/* import { ApiGatewayStack } from "../lib/stacks/svc-api-gateway-stack";
import { SvcPermissionsStack } from "../lib/stacks/svc-permissions-stack"; */

const app = new cdk.App();
new ApiGatewayStack(app, "SvcApiGateway");
// createStackSvcWebSocketApi(app)
// Stacks creation
// new SvcPermissionsStack(app, "svc-permissions-stack",{});
/* new ApiGatewayStack(app, "SvcApiGateway", {}); */
