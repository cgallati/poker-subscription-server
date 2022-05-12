import {gql} from "apollo-server-core";
import {makeExecutableSchema} from "@graphql-tools/schema";
import {resolvers} from "./resolvers.js";

const typeDefs = gql`
type Subscription {
  counterChanged: Int
  roomUpdated: RoomState
}
type Query {
  counter: Int
  roomState(id: String):  RoomState
}
type Mutation {
    incrementCounter: Int 
    createRoom(name: String): RoomState
    updateName(id: String, name: String): RoomState
}

type RoomState {
    id: String
    name: String
}

`

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});