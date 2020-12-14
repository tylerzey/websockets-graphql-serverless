import { storeItem } from "../../common/dynamo";
import { dynamoSeparator } from "../../common/dynamoHelpers";
import { RootMutationActivityPostArgs } from "../../generated/schemaTypes";
import { DynamoLabels, ActivityType } from "../../types/graphQLTypes";
import { postToConnection } from "../../common/apiGateway";

export async function createActivity(
  args: RootMutationActivityPostArgs
): Promise<void> {
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
}

export async function notifyOfNewActivity(
  activity: ActivityType,
  connectionId: string
): Promise<void> {
  const data = JSON.stringify({
    id: "2",
    type: "data",
    payload: {
      subscribeToActivity: activity,
    },
  });

  await postToConnection({ connectionId, data });
}
