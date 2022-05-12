import {gql} from "apollo-server-core";
import {makeExecutableSchema} from "@graphql-tools/schema";
import {resolvers} from "./resolvers.js";

const typeDefs = gql`
type Subscription {
  counterChanged: Int
}
type Query {
  counter: Int
}
type Mutation {
    incrementCounter: Int 
}
`

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});