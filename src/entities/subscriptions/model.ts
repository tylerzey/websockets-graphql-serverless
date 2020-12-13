import {
  twoHoursFromNowInSeconds,
} from "../../common/dateFunctions";
import { storeItem } from "../../common/dynamo";
import { dynamoLabels, dynamoSeparator } from "../../common/dynamoHelpers";
import { RootSubscriptionSubscribeToActivityArgs } from "../../generated/schemaTypes";
import { ContextType } from "../../types/graphQLTypes";

export async function getSubscriptions(search: any) {
  console.log("getsubscriptions");

  return [];
}

export async function createSubscription(
  args: RootSubscriptionSubscribeToActivityArgs,
  context: ContextType
) {
  console.log("createSubscription", args);

  const subscription = {
    key: `${dynamoLabels.connection}${dynamoSeparator}${context.user.connectionId}`,
    secondaryKey: `${dynamoLabels.subscription}${dynamoSeparator}${args.activityTypeToSubscribeTo}`,
    expiresAfter: twoHoursFromNowInSeconds,
  };

  await storeItem(subscription);

  return null;
}

export async function deleteSubscription(args: any) {
  console.log("deleteSubscription");

  return {};
}
