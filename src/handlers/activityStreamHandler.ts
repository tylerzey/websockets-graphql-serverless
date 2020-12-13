import "source-map-support/register";
import { DynamoDBStreamEvent } from "aws-lambda";
import { itemToData } from "dynamo-converters";
import { dynamoLabels } from "../common/dynamoHelpers";
import { getSubscriptions } from "../entities/subscriptions/model";

async function publishWebsocketMessagesForRecord(
  currentRecordAsJavascriptObject: any
): Promise<void> {
  if (currentRecordAsJavascriptObject.label !== dynamoLabels.activity) {
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

      const currentRecordAsJavascriptObject = itemToData(currentRecord);
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
