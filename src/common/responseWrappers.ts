import { APIGatewayProxyResult } from "aws-lambda";

const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
};

const buildResponse = (
  body: string,
  statusCode: number,
  headers = {}
): APIGatewayProxyResult => {
  return {
    headers: { ...defaultHeaders, ...headers },
    statusCode,
    body,
  };
};

export const buildCorsSuccessResponse = (body = ""): APIGatewayProxyResult => {
  return buildResponse(body, 200);
};

export const buildErrorResponse = (
  errorMessage = "error"
): APIGatewayProxyResult => {
  return buildResponse(errorMessage, 500);
};
