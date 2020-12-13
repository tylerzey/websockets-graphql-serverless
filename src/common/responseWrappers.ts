import crypto from "crypto";
import { APIGatewayProxyEventHeaders, APIGatewayProxyResult } from "aws-lambda";

const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

const buildResponse = (
  body: string,
  statusCode: number,
  headers = {}
): APIGatewayProxyResult => {
  const response = {
    headers: { ...defaultHeaders, ...headers },
    statusCode,
    body,
  };

  console.log(response);

  return response;
};

export const buildCorsSuccessResponse = (
  body = "",
  incomingHeaders?: APIGatewayProxyEventHeaders
): APIGatewayProxyResult => {
  const wsKey = incomingHeaders?.["Sec-WebSocket-Key"];
  const protocols = incomingHeaders?.["Sec-WebSocket-Protocol"];

  let selectedProtocol: undefined | string;
  let wsResponseSecKey: undefined | string;

  // implementation borrowed from:
  // // https://github.com/sitegui/nodejs-websocket/pull/30/files
  if (wsKey) {
    const decodedWsKey = Buffer.from(wsKey, "base64");
    const magicKey = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
    const sha1 = crypto.createHash("sha1");
    sha1.end(decodedWsKey + magicKey);
    wsResponseSecKey = sha1.read().toString("base64");
    console.log({ wsResponseSecKey });
  }

  if (protocols) {
    selectedProtocol = protocols.split(",")?.[0]?.trim();
  }

  const headers = wsResponseSecKey
    ? {
        "Sec-WebSocket-Accept": wsResponseSecKey,
        "Sec-WebSocket-Protocol": selectedProtocol,
        Upgrade: "websocket",
        Connection: "Upgrade",
      }
    : {};

  return buildResponse(body, 200, headers);
};

export const buildErrorResponse = (
  errorMessage = "error"
): APIGatewayProxyResult => {
  return buildResponse(errorMessage, 500);
};
