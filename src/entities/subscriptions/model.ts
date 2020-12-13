import { twoHoursInSeconds } from "../../common/dateFunctions";
import { storeItem } from "../../common/dynamo";
import { dynamoLabels, dynamoSeparator } from "../../common/dynamoHelpers";

export async function getSubscriptions(search: any) {
  console.log("getsubscriptions");
  return [];
}

export async function createSubscription(args: {
  activityName: string;
  connectionId: string;
}) {
  console.log("createSubscription", args);

  const subscription = {
    key: `${dynamoLabels.connection}${dynamoSeparator}${args.connectionId}`,
    secondaryKey: `${dynamoLabels.subscription}${dynamoSeparator}${args.activityName}`,
    expiresAfter: Date.now() + (twoHoursInSeconds || 0),
  };

  await storeItem(subscription);
  return {};
}

export async function deleteSubscription(args: any) {
  console.log("deleteSubscription");
  return {};
}
