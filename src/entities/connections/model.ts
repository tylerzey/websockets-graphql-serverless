import { APIGatewayEvent } from "aws-lambda";
import {
  twoHoursFromNowInSeconds,
} from "../../common/dateFunctions";
import { storeItem } from "../../common/dynamo";
import { dynamoLabels, dynamoSeparator } from "../../common/dynamoHelpers";
import {
  buildCorsSuccessResponse,
  buildErrorResponse,
} from "../../common/responseWrappers";

export async function createConnection(
  connectionId: string,
  {
    connectedAt,
    domain,
    stage,
  }: { connectedAt?: number; domain?: string; stage?: string }
) {
  console.log("createConnection");

  const connection = {
    key: `${dynamoLabels.connection}${dynamoSeparator}${connectionId}`,
    secondaryKey: `${dynamoLabels.connection}${dynamoSeparator}${connectionId}`,
    expiresAfter: twoHoursFromNowInSeconds,
    connectedAt,
    domain,
    stage,
  };

  await storeItem(connection);

  return null;
}

export async function getConnectionById(connectionId: string) {
  console.log("getConnectionById");

  return null;
}

export async function handleConnectionRequest(event: APIGatewayEvent) {
  if (!event.requestContext?.connectionId) {
    return buildErrorResponse("Error");
  }

  const connectionId = event?.requestContext?.connectionId;
  const connectedAt = event?.requestContext?.connectedAt;
  const domain = event?.requestContext?.domainName;
  const stage = event?.requestContext?.stage;

  await createConnection(connectionId, { connectedAt, domain, stage });

  return buildCorsSuccessResponse("Connected", event.headers);
}
