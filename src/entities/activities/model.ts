import { queryItems, storeItem } from "../../common/dynamo";
import { dynamoSeparator } from "../../common/dynamoHelpers";
import { RootMutationActivityPostArgs } from "../../generated/schemaTypes";
import { DynamoLabels, ActivityType } from "../../types/graphQLTypes";
import { postToConnection } from "./apiGateway";

export async function createActivity(args: RootMutationActivityPostArgs) {
  console.log("createActivity", args);

  if (!args?.connectionId || !args.activityName) {
    throw new Error("Missing args");
  }

  const activity: ActivityType = {
    key: `${DynamoLabels.ACTIVITY}${dynamoSeparator}${args.activityName}`,
    secondaryKey: `${DynamoLabels.CONNECTION}${dynamoSeparator}${args.connectionId}`,
    label: DynamoLabels.ACTIVITY,
    activityName: args.activityName,
  };
  await storeItem(activity);

  return null;
}

export async function getActivities(args: {
  activitySearchType: string;
}): Promise<ActivityType[]> {
  const items = await queryItems<ActivityType>(
    `${DynamoLabels.ACTIVITY}${dynamoSeparator}${args.activitySearchType}`
  );
  console.log("items: ", items);

  return items;
}

export async function notifyOfNewActivity(
  activity: ActivityType,
  connectionId: string
): Promise<void> {
  const data = JSON.stringify({
    id: activity.key,
    type: "data",
    payload: { data: { subscribeToActivity: { ...activity } } },
  });

  await postToConnection({ connectionId, data });
}
