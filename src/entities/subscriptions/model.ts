import { twoHoursFromNowInSeconds } from "../../common/dateFunctions";
import { queryItems, storeItem } from "../../common/dynamo";
import { dynamoLabels, dynamoSeparator } from "../../common/dynamoHelpers";
import { RootSubscriptionSubscribeToActivityArgs } from "../../generated/schemaTypes";
import { ContextType } from "../../types/graphQLTypes";

export async function getSubscriptions(args: { activitySearchType: string }) {
  const items = await queryItems(
    `${dynamoLabels.subscription}${dynamoSeparator}${args.activitySearchType}`
  );
  console.log("items: ", items);

  return items;
}

export async function createSubscription(
  args: RootSubscriptionSubscribeToActivityArgs,
  context: ContextType
) {
  console.log("createSubscription", args);

  const subscription = {
    key: `${dynamoLabels.subscription}${dynamoSeparator}${args.activityTypeToSubscribeTo}`,
    secondaryKey: `${dynamoLabels.connection}${dynamoSeparator}${context.user.connectionId}`,
    expiresAfter: twoHoursFromNowInSeconds,
    label: dynamoLabels.subscription,
    activityName: args.activityTypeToSubscribeTo,
    connectionId: context.user.connectionId,
  };

  await storeItem(subscription);

  return null;
}

export async function deleteSubscription(args: any) {
  console.log("deleteSubscription");

  return {};
}
