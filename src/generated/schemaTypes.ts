export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type RootQuery = {
  __typename?: 'RootQuery';
  activities?: Maybe<Array<Maybe<Activity>>>;
};


export type RootQueryActivitiesArgs = {
  id?: Maybe<Scalars['String']>;
  search?: Maybe<Scalars['String']>;
};

export type Activity = {
  __typename?: 'Activity';
  metadata?: Maybe<ActivityMetadata>;
};

export type ActivityMetadata = {
  __typename?: 'ActivityMetadata';
  activityName?: Maybe<Scalars['String']>;
  connectionId?: Maybe<Scalars['String']>;
};

export type RootMutation = {
  __typename?: 'RootMutation';
  activityPost?: Maybe<Activity>;
};


export type RootMutationActivityPostArgs = {
  metadata?: Maybe<ActivityPostMetadata>;
};

export type ActivityPostMetadata = {
  activityName: Scalars['String'];
  connectionId: Scalars['String'];
};

export type RootSubscription = {
  __typename?: 'RootSubscription';
  subscribeToActivity?: Maybe<Activity>;
};


export type RootSubscriptionSubscribeToActivityArgs = {
  activityTypeToSubscribeTo: Scalars['String'];
};
