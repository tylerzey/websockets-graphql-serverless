import "source-map-support/register";
import { DynamoDBStreamEvent } from "aws-lambda";
import { itemToData } from "dynamo-converters";
import { DynamoLabels, EntityType } from "../types/graphQLTypes";
import { notifyOfNewActivity } from "../entities/activities/model";

const notifications = {
  [DynamoLabels.ACTIVITY]: [notifyOfNewActivity],
  [DynamoLabels.SUBSCRIPTION]: [],
  [DynamoLabels.CONNECTION]: [],
};

async function publishWebsocketMessagesForRecord(
  currentRecordAsJavascriptObject: EntityType
): Promise<void> {
  if (!currentRecordAsJavascriptObject.label) {
    console.log("no label");

    return;
  }
  const possibleSubscriptions =
    notifications[currentRecordAsJavascriptObject.label];

  for (const subscription of possibleSubscriptions) {
    // @ts-expect-error
    await subscription(currentRecordAsJavascriptObject);
  }
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
