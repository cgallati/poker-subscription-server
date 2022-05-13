import {gql} from "apollo-server-core";
import {makeExecutableSchema} from "@graphql-tools/schema";
import {resolvers} from "./resolvers.js";

const typeDefs = gql`
type Subscription {
  roomUpdated(id: String): RoomState
}
type Query {
  roomState(id: String):  RoomState
  allRooms: [RoomState]
}
type Mutation {
    createRoom(name: String): RoomState
    updateRoomName(id: String, name: String): RoomState
    createUser(roomId: String, name: String, emoji: String): User
    createRound(roomId: String, name: String, desc: String): Round
    startRound(roomId: String, id: String): String
    endRound(roomId: String, points: Int): Round
    vote(roomId: String, userName: String, points: Int): Int
}

type RoomState {
    id: String
    name: String
    users: [User]
    currentRoundId: String
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
    vote: Int
}

type Vote {
    user: String
    points: Int
}


`

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});