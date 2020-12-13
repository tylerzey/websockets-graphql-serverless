import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export async function handler(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  if (!event.requestContext?.connectionId) {
    return { statusCode: 500, body: "Missing connectionId" };
  }

  const connectionId = event?.requestContext?.connectionId;
  const connectedAt = event?.requestContext?.connectedAt;
  const domain = event?.requestContext?.domainName;
  const stage = event?.requestContext?.stage;
  // store connection in ddb

  return { statusCode: 200, body: "Connected." };
}
