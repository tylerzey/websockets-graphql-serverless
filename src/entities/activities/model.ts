import { dynamoLabels, dynamoSeparator } from "../../common/dynamoHelpers";

export async function createActivity(args: any) {
  console.log("postActivity", args);
  const activityName = "todo";
  const connectionId = "connectionId";

  const activity = {
    key: `${dynamoLabels.connection}${dynamoSeparator}${connectionId}`,
    secondaryKey: `${dynamoLabels.activity}${dynamoSeparator}${activityName}`,
  };
  return null;
}

export async function subscribeToActivityByType() {
  console.log("subscribeToActivityByType");
  return null;
}
