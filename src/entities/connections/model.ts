import { twoHoursInSeconds } from "../../common/dateFunctions";
import { storeItem } from "../../common/dynamo";
import { dynamoLabels, dynamoSeparator } from "../../common/dynamoHelpers";

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
    expiresAfter: Date.now() + (twoHoursInSeconds || 0),
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
