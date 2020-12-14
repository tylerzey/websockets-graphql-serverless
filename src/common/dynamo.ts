import { ConditionExpression, DocumentClient } from "aws-sdk/clients/dynamodb";
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

export async function queryItems<T extends { [key: string]: any }>(
  key: string,
  filterExpression?: ConditionExpression
): Promise<T[]> {
  const params: DocumentClient.QueryInput = {
    TableName: getTableName(),
    KeyConditionExpression: "#key = :key",
    ExpressionAttributeNames: {
      "#key": "key",
    },
    ExpressionAttributeValues: {
      ":key": key,
    },
    ...(filterExpression && { FilterExpression: filterExpression }),
  };

  console.log("queryItems: ", params);

  const response = await client.query(params).promise();

  // @ts-expect-error
  return response.Items || [];
}
