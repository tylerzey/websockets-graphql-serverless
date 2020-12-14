import { APIGatewayEvent } from "aws-lambda";
import { twoHoursFromNowInSeconds } from "../../common/dateFunctions";
import { queryItems, storeItem } from "../../common/dynamo";
import { dynamoSeparator } from "../../common/dynamoHelpers";
import {
  buildCorsSuccessResponse,
  buildErrorResponse,
} from "../../common/responseWrappers";
import { DynamoLabels, ConnectionType } from "../../types/graphQLTypes";

export async function createConnection(
  connectionId: string,
  {
    connectedAt,
    domain,
    stage,
  }: { connectedAt?: number; domain?: string; stage?: string }
) {
  console.log("createConnection");

  const connection: ConnectionType = {
    key: `${DynamoLabels.CONNECTION}${dynamoSeparator}${connectionId}`,
    secondaryKey: `${DynamoLabels.CONNECTION}${dynamoSeparator}${connectionId}`,
    label: DynamoLabels.CONNECTION,
    expiresAfter: twoHoursFromNowInSeconds,
    connectedAt: connectedAt || Date.now(),
    domain,
    stage,
  };

  await storeItem(connection);

  return null;
}

export async function getConnectionById(
  connectionId: string
): Promise<ConnectionType | undefined> {
  console.log("getConnectionById");
  const items = await queryItems<ConnectionType>(
    `${DynamoLabels.CONNECTION}${dynamoSeparator}${connectionId}`
  );
  console.log("items: ", items);

  return items?.[0];
}

export async function deleteConnectionById(connectionId: string) {
  console.log("deleteConnectionById");

  // todo
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
