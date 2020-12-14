import { twoHoursFromNowInSeconds } from "../../common/dateFunctions";
import { queryItems, storeItem } from "../../common/dynamo";
import { dynamoSeparator } from "../../common/dynamoHelpers";
import { RootSubscriptionSubscribeToActivityArgs } from "../../generated/schemaTypes";
import {
  ContextType,
  DynamoLabels,
  SubscriptionType,
} from "../../types/graphQLTypes";

export async function getSubscriptions(args: {
  activitySearchType: string;
}): Promise<SubscriptionType[]> {
  const items = await queryItems<SubscriptionType>(
    `${DynamoLabels.SUBSCRIPTION}${dynamoSeparator}${args.activitySearchType}`
  );
  console.log("items: ", items);

  return items;
}

export async function createSubscription(
  args: RootSubscriptionSubscribeToActivityArgs,
  context: ContextType
): Promise<void> {
  console.log("createSubscription", args);
  const activityName = args.activityName;
  const connectionId = context.user.connectionId;

  if (!connectionId) {
    throw new Error("connectionId is empty");
  }

  const subscription: SubscriptionType = {
    key: `${DynamoLabels.SUBSCRIPTION}${dynamoSeparator}${activityName}`,
    secondaryKey: `${DynamoLabels.CONNECTION}${dynamoSeparator}${connectionId}`,
    expiresAfter: twoHoursFromNowInSeconds,
    label: DynamoLabels.SUBSCRIPTION,
    activityName,
    connectionId,
  };

  await storeItem(subscription);

  return;
}

export async function deleteSubscription(args: any) {
  console.log("deleteSubscription");

  return {};
}
