import { DynamoDBStreamEvent } from "aws-lambda";
import dynamoConverters from "dynamo-converters";
import { dynamoLabels } from "../common/dynamoHelpers";
import { getActivities } from "../entities/activities/model";

async function publishWebsocketMessagesForRecord(
  currentRecordAsJavascriptObject: any
): Promise<void> {
  if (currentRecordAsJavascriptObject.label !== dynamoLabels.activity) {
    return;
  }

  if (!currentRecordAsJavascriptObject.activityName) {
    return;
  }

  const subscriptionsToCurrentActivity = await getActivities({
    activitySearchType: currentRecordAsJavascriptObject.activityName,
  });
}

export async function handler(event: DynamoDBStreamEvent): Promise<void> {
  const records = event.Records || [];

  await Promise.all(
    records.map(async (record) => {
      const currentRecord = record?.dynamodb?.NewImage;
      console.log(currentRecord);

      if (!currentRecord) {
        return;
      }

      const currentRecordAsJavascriptObject = dynamoConverters.itemToData(
        currentRecord
      );
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
