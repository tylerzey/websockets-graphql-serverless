import {
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLList,
} from "graphql";
import {
  generateQueryType,
  CustomGraphQLType,
  generatePostType,
} from "../../common/generateTypesFromObject";
import {
  AuthenticatedUserType,
  ContextType,
  RootType,
} from "../../types/graphQLTypes";
import { createSubscription } from "../subscriptions/model";
import { postActivity } from "./model";

const metadata: CustomGraphQLType = {
  activityName: { type: GraphQLString, options: { post: true, patch: false } },
  byConnectionId: { type: GraphQLString },
};

const activityMetadataType = new GraphQLObjectType({
  name: `ActivityMetadata`,
  fields: generateQueryType(metadata),
});

const activityType = new GraphQLObjectType({
  name: `Activity`,
  fields: () => {
    return {
      metadata: { type: activityMetadataType },
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

const activityPostMutation = (authedUser: AuthenticatedUserType) => ({
  type: activityType,
  args: {
    metadata: {
      type: new GraphQLNonNull(
        generatePostType("ActivityPostMutation", metadata, authedUser)
      ),
    },
  },
  resolve: async (root: RootType, args: any, context: ContextType) => {
    return postActivity(args);
  },
});

const activitySubscription = (authedUser: AuthenticatedUserType) => ({
  type: activityType,
  args: {
    activityTypeToSubscribeTo: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (root: RootType, args: any, context: ContextType) => {
    await createSubscription(args);
    return null;
  },
});

export const activityQueries = (authedUser: AuthenticatedUserType) => ({
  activities: activityQuery(authedUser),
});

export const activityMutations = (authedUser: AuthenticatedUserType) => ({
  activityPost: activityPostMutation(authedUser),
});

export const activitySubscriptions = (authedUser: AuthenticatedUserType) => ({
  onActivityAdded: activitySubscription(authedUser),
});
