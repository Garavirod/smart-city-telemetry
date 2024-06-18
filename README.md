# Overview Telemetry city project

Description : Real time vehicle (Train) location monitoring.

This is an AWS project build under CDK development with TypeScript. implements 
Github Actions as CI/CD for deployments.

- AWS services:
    - Lambda
    - Api Gateway
    - Dynamo
    - Web socket API
    - SNS
    - Pinpoint
    - SQS
    - Cognito

- General diagram

<img src="/assets/diagrams/train_location_diagram.png">
    
# CDK Useful commands

The `cdk.json` file tells the CDK Toolkit how to execute your app.

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
