import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
} from "graphql";
import { queryItems } from "../../common/dynamo";
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
      activityName: { type: GraphQLString },
      connectionId: { type: GraphQLString },
    };
  },
});

export const activitySubscriptions = (authedUser: AuthenticatedUserType) => ({
  subscribeToActivity: {
    type: new GraphQLList(activityType),
    args: {
      activityName: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (root: RootType, args: any, context: ContextType) => {
      await createSubscription(args, context);

      return queryItems(args);
    },
  },
});

export const activityQueries = (authedUser: AuthenticatedUserType) => ({
  queryActivitiesByActivityName: {
    name: "ActivityQuery",
    type: new GraphQLList(activityType),
    args: {
      activityName: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (root: RootType, args: any) => {
      console.log("activity graphql query resolving on ", args);

      return queryItems(args);
    },
  },
});

export const activityMutations = (authedUser: AuthenticatedUserType) => ({
  activityPost: {
    type: activityType,
    args: {
      activityName: { type: new GraphQLNonNull(GraphQLString) },
      connectionId: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (root: RootType, args: any) => {
      return createActivity(args);
    },
  },
});
