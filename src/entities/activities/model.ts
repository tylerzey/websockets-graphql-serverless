import { storeItem } from "../../common/dynamo";
import { dynamoLabels, dynamoSeparator } from "../../common/dynamoHelpers";

export async function createActivity(args: {
  connectionId: string;
  activityName: string;
}) {
  console.log("createActivity", args);

  const activity = {
    key: `${dynamoLabels.connection}${dynamoSeparator}${args.connectionId}`,
    secondaryKey: `${dynamoLabels.activity}${dynamoSeparator}${args.activityName}`,
  };
  await storeItem(activity);

  return null;
}

export async function subscribeToActivityByType() {
  console.log("subscribeToActivityByType");

  return null;
}
