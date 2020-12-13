import { storeItem } from "../../common/dynamo";
import { dynamoLabels, dynamoSeparator } from "../../common/dynamoHelpers";
import { RootMutationActivityPostArgs } from "../../generated/schemaTypes";

export async function createActivity(args: RootMutationActivityPostArgs) {
  console.log("createActivity", args);

  if (!args.metadata?.connectionId || !args.metadata.activityName) {
    throw new Error("Missing args");
  }

  const activity = {
    key: `${dynamoLabels.connection}${dynamoSeparator}${args.metadata.connectionId}`,
    secondaryKey: `${dynamoLabels.activity}${dynamoSeparator}${args.metadata.activityName}`,
    label: dynamoLabels.activity,
  };
  await storeItem(activity);

  return null;
}

export async function getActivities(args: { activitySearchType: string }) {
  //
}
