import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { buildCorsSuccessResponse } from "../common/responseWrappers";
import { createConnection } from "../entities/connections/model";

export async function handler(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  console.log("connections handler");
  console.log(event);

  if (!event.requestContext?.connectionId) {
    return { statusCode: 500, body: "Missing connectionId" };
  }

  const connectionId = event?.requestContext?.connectionId;
  const connectedAt = event?.requestContext?.connectedAt;
  const domain = event?.requestContext?.domainName;
  const stage = event?.requestContext?.stage;

  await createConnection(connectionId, { connectedAt, domain, stage });

  return buildCorsSuccessResponse("Connected", event.headers);
}
