import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URL,
  cache: new InMemoryCache(),
  queryDeduplication: false,
  assumeImmutableResults: true
});


export const GET_TRADES = gql
  `query events(
  $sender: String
  $skip: Int
  $take: Int
  $types: [String!]
) {
  events(
    sender: $sender
    skip: $skip
    take: $take
    types: $types
  ) {
    total
    skip
    take
    list {
        timestamp
      description
      type
    }
  }
}`;