import "source-map-support/register";
import { DynamoDBStreamEvent } from "aws-lambda";
import { ApiGatewayManagementApi } from "aws-sdk";
import { itemToData } from "dynamo-converters";
import { dynamoLabels } from "../common/dynamoHelpers";
import { getSubscriptions } from "../entities/subscriptions/model";
import { getConnectionById } from "../entities/connections/model";

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

  await Promise.all(
    subscriptionsToCurrentActivity.map(async (subscription) => {
      const connectionId = subscription?.connectionId as string;

      if (!connectionId) {
        return;
      }

      const connection = await getConnectionById(connectionId);
      console.log(connection);
      const data = JSON.stringify({
        id: currentRecordAsJavascriptObject.key,
        type: "data",
        payload: {
          data: {
            subscribeToActivity: { activityName: "x", connectionId: "x" },
          },
        },
      });
      console.log(data);

      try {
        await new ApiGatewayManagementApi({
          endpoint:
            "https://ga6eq542y6.execute-api.us-east-1.amazonaws.com/prod",
        })
          .postToConnection({
            ConnectionId: connectionId,
            Data: data,
          })
          .promise();
      } catch (error) {
        console.error(error);
      }
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
