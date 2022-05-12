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
  allRooms: [RoomState]
}
type Mutation {
    incrementCounter: Int 
    createRoom(name: String): RoomState
    updateName(id: String, name: String): RoomState
    createUser(roomID: String, name: String, emoji: String): User
}

type RoomState {
    id: String
    name: String
}

type Round {
    id: String
    name: String
    desc: String
    points: Int
}

type User {
    name: String    # unique, used as ID
    emoji: String   # unicode
}


`

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});