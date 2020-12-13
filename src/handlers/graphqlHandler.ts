import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { graphql, GraphQLSchema, GraphQLObjectType } from "graphql";
import {
  buildCorsSuccessResponse,
  buildErrorResponse,
} from "../common/responseWrappers";
import {
  getQueries,
  getMutations,
  getSubscriptions,
} from "../common/combineQueriesAndMutations";
import {
  RootType,
  AuthenticatedUserType,
  ContextType,
} from "../types/graphQLTypes";

export function buildSchema(
  authenticatedUser: AuthenticatedUserType
): GraphQLSchema {
  return new GraphQLSchema({
    subscription: new GraphQLObjectType({
      name: "RootSubscription",
      fields: getSubscriptions(authenticatedUser),
    }),
    query: new GraphQLObjectType({
      name: "RootQuery",
      fields: getQueries(authenticatedUser),
    }),
    mutation: new GraphQLObjectType({
      name: "RootMutation",
      fields: getMutations(authenticatedUser),
    }),
  });
}

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    console.log(event);

    if (!event.body) {
      return buildErrorResponse("Body required");
    }

    const { query, variables } = JSON.parse(event.body);

    const user: AuthenticatedUserType = null;
    const context: ContextType = { user, event };
    const root: RootType = { root: "root" };
    const schema = buildSchema(user);

    const { data, errors } = await graphql(
      schema,
      query,
      root,
      context,
      variables
    );

    return buildCorsSuccessResponse(
      JSON.stringify({ data, errors }),
      event.headers
    );
  } catch (error) {
    console.error(error);

    return buildErrorResponse("Server error");
  }
}
