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
  queryActivitiesByActivityName?: Maybe<Array<Maybe<Activity>>>;
};


export type RootQueryQueryActivitiesByActivityNameArgs = {
  activityName: Scalars['String'];
};

export type Activity = {
  __typename?: 'Activity';
  activityName?: Maybe<Scalars['String']>;
  connectionId?: Maybe<Scalars['String']>;
};

export type RootMutation = {
  __typename?: 'RootMutation';
  activityPost?: Maybe<Activity>;
};


export type RootMutationActivityPostArgs = {
  activityName: Scalars['String'];
  connectionId: Scalars['String'];
};

export type RootSubscription = {
  __typename?: 'RootSubscription';
  subscribeToActivity?: Maybe<Array<Maybe<Activity>>>;
};


export type RootSubscriptionSubscribeToActivityArgs = {
  activityName: Scalars['String'];
};
