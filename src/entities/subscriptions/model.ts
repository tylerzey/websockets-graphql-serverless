import { dynamoLabels, dynamoSeparator } from "../../common/dynamoHelpers";

export async function getSubscriptions(search: any) {
  console.log("getsubscriptions");
  return [];
}

export async function createSubscription(args: any) {
  console.log("createSubscription", args);
  const activityName = "todo";
  const connectionId = "todo";

  const subscription = {
    key: `${dynamoLabels.connection}${dynamoSeparator}${connectionId}`,
    secondaryKey: `${dynamoLabels.subscription}${dynamoSeparator}${activityName}`,
  };

  return {};
}

export async function deleteSubscription(args: any) {
  console.log("deleteSubscription");
  return {};
}
