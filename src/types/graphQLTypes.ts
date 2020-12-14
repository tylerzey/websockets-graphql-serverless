import { APIGatewayProxyEvent } from "aws-lambda";

export type AuthenticatedUserType = { connectionId: string | undefined };
export type RootType = Record<string, unknown>;
export type ContextType = {
  user: AuthenticatedUserType;
  event: APIGatewayProxyEvent;
};

export enum DynamoLabels {
  SUBSCRIPTION = "SUBSCRIPTION",
  ACTIVITY = "ACTIVITY",
  CONNECTION = "CONNECTION",
}
export interface ActivityType {
  key: string;
  secondaryKey: string;
  label: DynamoLabels.ACTIVITY;
  activityName: string;
}
export interface ConnectionType {
  key: string;
  secondaryKey: string;
  label: DynamoLabels.CONNECTION;
  expiresAfter: number;
  connectedAt: number;
  domain?: string;
  stage?: string;
}
export interface SubscriptionType {
  key: string;
  secondaryKey: string;
  expiresAfter: number;
  label: DynamoLabels.SUBSCRIPTION;
  activityName: string;
  connectionId: string;
}
export type EntityType = ConnectionType | ActivityType | SubscriptionType;
