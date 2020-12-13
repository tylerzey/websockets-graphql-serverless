import { queryItems, storeItem } from "../../common/dynamo";
import { dynamoLabels, dynamoSeparator } from "../../common/dynamoHelpers";
import { RootMutationActivityPostArgs } from "../../generated/schemaTypes";

export async function createActivity(args: RootMutationActivityPostArgs) {
  console.log("createActivity", args);

  if (!args?.connectionId || !args.activityName) {
    throw new Error("Missing args");
  }

  const activity = {
    key: `${dynamoLabels.activity}${dynamoSeparator}${args.activityName}`,
    secondaryKey: `${dynamoLabels.connection}${dynamoSeparator}${args.connectionId}`,
    label: dynamoLabels.activity,
    activityName: args.activityName,
  };
  await storeItem(activity);

  return null;
}

export async function getActivities(args: { activitySearchType: string }) {
  const items = await queryItems(
    `${dynamoLabels.activity}${dynamoSeparator}${args.activitySearchType}`
  );
  console.log("items: ", items);

  return items;
}
