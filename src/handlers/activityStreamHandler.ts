import "source-map-support/register";
import { DynamoDBStreamEvent } from "aws-lambda";
import { itemToData } from "dynamo-converters";
import { getSubscriptions } from "../entities/subscriptions/model";
import { DynamoLabels, EntityType } from "../types/graphQLTypes";
import { notifyOfNewActivity } from "../entities/activities/model";

async function publishWebsocketMessagesForRecord(
  currentRecordAsJavascriptObject: EntityType
): Promise<void> {
  if (currentRecordAsJavascriptObject.label !== DynamoLabels.ACTIVITY) {
    console.log("no label");

    return;
  }

  if (!currentRecordAsJavascriptObject.activityName) {
    console.log("no activity name");

    return;
  }

  const subscriptionsToCurrentActivity = await getSubscriptions({
    activitySearchType: currentRecordAsJavascriptObject.activityName,
  });

  console.log(
    "subscriptionsToCurrentActivity: ",
    subscriptionsToCurrentActivity
  );

  await Promise.all(
    subscriptionsToCurrentActivity.map(async (subscription) => {
      const connectionId = subscription?.connectionId as string;

      if (!connectionId) {
        return;
      }

      await notifyOfNewActivity(currentRecordAsJavascriptObject, connectionId);
    })
  );
}

export async function handler(event: DynamoDBStreamEvent): Promise<void> {
  const records = event.Records || [];

  const x = await Promise.all(
    records.map(async (record) => {
      const currentRecord = record?.dynamodb?.NewImage;
      console.log(currentRecord);

      if (!currentRecord) {
        return;
      }

      // @ts-expect-error
      const currentRecordAsJavascriptObject = itemToData(
        currentRecord
      ) as EntityType;
      console.log(currentRecordAsJavascriptObject);

      try {
        await publishWebsocketMessagesForRecord(
          currentRecordAsJavascriptObject
        );
      } catch (error) {
        console.error(error);
      }
    })
  );
}
