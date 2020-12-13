import { AuthenticatedUserType } from "../types/graphQLTypes";
import {
  activityMutations,
  activityQueries,
  activitySubscriptions,
} from "../entities/activities/graphql";

export const getQueries = (user: AuthenticatedUserType) => {
  return {
    ...activityQueries(user),
  };
};

export const getMutations = (user: AuthenticatedUserType) => {
  return {
    ...activityMutations(user),
  };
};

export function getSubscriptions(user: AuthenticatedUserType) {
  return {
    ...activitySubscriptions(user),
  };
}
