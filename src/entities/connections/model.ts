import { twoHoursInSeconds } from "../../common/dateFunctions";
import { dynamoLabels, dynamoSeparator } from "../../common/dynamoHelpers";

export async function createConnection(args: any) {
  console.log("createConnection");
  const connectionId = "connectionId";
  const connection = {
    key: `${dynamoLabels.connection}${dynamoSeparator}${connectionId}`,
    secondaryKey: `${dynamoLabels.connection}${dynamoSeparator}${connectionId}`,
    expiresAfter: Date.now() + (twoHoursInSeconds || 0),
  };
  return null;
}

export async function getConnectionById(connectionId: string) {
  console.log("getConnectionById");
  return null;
}
