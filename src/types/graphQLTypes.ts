import { APIGatewayProxyEvent } from "aws-lambda";

export type AuthenticatedUserType = { connectionId: string | undefined };
export type RootType = Record<string, unknown>;
export type ContextType = {
  user: AuthenticatedUserType;
  event: APIGatewayProxyEvent;
};
