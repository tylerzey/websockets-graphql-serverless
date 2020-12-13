import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInputObjectType,
} from "graphql";
import { RootMutationActivityPostArgs } from "../../generated/schemaTypes";
import {
  AuthenticatedUserType,
  ContextType,
  RootType,
} from "../../types/graphQLTypes";
import { createSubscription } from "../subscriptions/model";
import { createActivity } from "./model";

const activityType = new GraphQLObjectType({
  name: `Activity`,
  fields: () => {
    return {
      metadata: {
        type: new GraphQLObjectType({
          name: `ActivityMetadata`,
          fields: {
            activityName: { type: GraphQLString },
            connectionId: { type: GraphQLString },
          },
        }),
      },
    };
  },
});

const activityQuery = (authedUser: AuthenticatedUserType) => ({
  name: "ActivityQuery",
  type: new GraphQLList(activityType),
  args: {
    id: { type: GraphQLString },
    search: { type: GraphQLString },
  },
  resolve: async (root: RootType, args: any, context: ContextType) => {
    console.log("activity graphql query resolving on ", args);

    return null;
  },
});

export const activitySubscriptions = (authedUser: AuthenticatedUserType) => ({
  subscribeToActivity: {
    type: activityType,
    args: {
      activityTypeToSubscribeTo: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (root: RootType, args: any, context: ContextType) => {
      await createSubscription(args);
      return null;
    },
  },
});

export const activityQueries = (authedUser: AuthenticatedUserType) => ({
  activities: activityQuery(authedUser),
});

export const activityMutations = (authedUser: AuthenticatedUserType) => ({
  activityPost: {
    type: activityType,
    args: {
      metadata: {
        type: new GraphQLInputObjectType({
          name: "ActivityPostMetadata",
          fields: {
            activityName: { type: new GraphQLNonNull(GraphQLString) },
            connectionId: { type: new GraphQLNonNull(GraphQLString) },
          },
        }),
      },
    },
    resolve: async (root: RootType, args: RootMutationActivityPostArgs, context: ContextType) => {
      return createActivity(args.metadata);
    },
  },
});
