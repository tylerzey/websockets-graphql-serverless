import { ApiGatewayManagementApi } from "aws-sdk";
import { getWebsocketEndpoint } from "./getEnvironmentVariables";

export async function postToConnection(args: {
  connectionId: string;
  data: string;
}): Promise<void> {
  console.log("postToConnection", JSON.stringify(args));

  try {
    await new ApiGatewayManagementApi({ endpoint: getWebsocketEndpoint() })
      .postToConnection({ ConnectionId: args.connectionId, Data: args.data })
      .promise();
  } catch (error) {
    console.error(error);
  }
}
