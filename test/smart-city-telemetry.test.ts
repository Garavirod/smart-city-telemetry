import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as ApiGatewayStack from '../lib/stacks/svc-api-gateway-stack';
import * as PermissionStack from '../lib/stacks/svc-permissions-stack';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/smart-city-telemetry-stack.ts
test('SQS Queue Created', () => {
  const app = new cdk.App();
    // WHEN
  const stack1 = new ApiGatewayStack.ApiGatewayStack(app, 'ApiGatewayStack');
  const template1 = Template.fromStack(stack1);

  /* const stack2 = new PermissionStack.SvcPermissionsStack(app, 'SvcPermissionsStack');
  const template2 = Template.fromStack(stack2);
 */
    // THEN

  /* template.hasResourceProperties('AWS::SQS::Queue', {
    VisibilityTimeout: 300
  }); */
});
