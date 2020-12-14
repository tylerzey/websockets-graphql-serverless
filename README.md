# Serverless GraphQL Subscriptions & WebSockets

AWS APIGateway provides a cheap, scalable way to do websockets out of the box.

Your webclients can create connections to API Gateway directly and not maintain long-lived connections directly with a server.

This let's you do really flexible things behind the scenes when it comes to using streams and events to publish to websocket channels.

This repository is an example setup showing how Serverless, GraphQL (without Apollo Server), and DynamoDB can be added to any existing Serverless GraphQL setup.

## Architecture

1. Connection Handler

   The connection handler is responsible for allowing websockets to connect and disconnect from API Gateway. It also stores the connectionIds in DynamoDB for use later

2. GraphQL Handler

   This is a full-GraphQL endpoint. You could put an entire api for a business in here. The subscription GraphQL actions that are exposed through this API are only responsible for storing in DynamoDB the request of a connection to be notified about a certain event. These subscriptions **do not** actually send the messages via websockets.

3. Stream Handler

   The final handler is a DynamoDB stream handler. This handler examines items to see if there are any subscriptions that need to be notified about the change. It then calls API Gateway directly via (ApiGatewayManagementApi().postToConnection()) and let's API Gateway send the message to any client that is still maintaining a websocket connection.

## Flexibility

Since you could basically swap out DynamoDB in this example for your main datastore, you could essentially catch events from anywhere (EventBridge, SQS, SNS), format them, and then publish them to APIGateway.

This completely decouples the subscribing to events via GraphQL from the publishing of change events.

## Deploying

1. Clone the repo
2. yarn
3. ./node_modules/serverless/bin/serverless.js deploy --stage prod

You will see your websocket and http addresses printed to the console after you deploy.
