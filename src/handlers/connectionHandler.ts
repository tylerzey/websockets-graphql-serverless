import "source-map-support/register";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleConnectionRequest } from "../entities/connections/model";

export async function handler(
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  console.log("connections handler");
  console.log(event);

  return await handleConnectionRequest(event);
}
