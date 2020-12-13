import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { getTableName } from "./getEnvironmentVariables";

const client = new DocumentClient({ region: process.env.region });

export async function storeItem(item: DocumentClient.PutItemInputAttributeMap) {
  const params: DocumentClient.PutItemInput = {
    TableName: getTableName(),
    Item: item,
  };

  console.log("storeItem: ", params);

  return client.put(params).promise();
}
