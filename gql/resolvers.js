import {pubsub} from "../pubsub.js";
import { v4 as uuidv4 } from 'uuid';
import {withFilter} from "graphql-subscriptions";
let currentNumber = 0;

let rooms = [{
    id: "d4a351f2-a218-4fe2-9ebd-8473b6e1ec76",
    name: "Chad's test room",
    users: [],
    rounds: [],
    currentRoundId: undefined,
}]

const EVENT = {
    roomUpdated: 'ROOM_UPDATED'
}

const getRoom = (id) => {
    const room = rooms.find(room => room.id === id) || null
    if (!room) {
        throw new Error('Room not found')
    }
    return room
}

const updateRoom = (newState) => pubsub.publish(EVENT.roomUpdated, { roomUpdated: newState})

const getCurrentRound = () => {

}

export const resolvers = {
    Subscription: {
        roomUpdated: {
            subscribe: withFilter(
                () => pubsub.asyncIterator([EVENT.roomUpdated]),
                (payload, variables) => payload.roomUpdated.id === variables.id
            )
        }
    },
    Query: {
        roomState: (_, {id}) => {
            return getRoom(id)
        },
        allRooms: () => {
            return rooms
        }
    },
    Mutation: {
        createRoom: (_, { name }) => {
            const room = {
                id: uuidv4(),
                name,
                users: [],
                rounds: []
            }
            rooms.push(room)
            return room
        },
        updateRoomName: (_, {id, name}) => {
            const room = getRoom(id)
            room.name = name
            updateRoom(room)
            return room
        },
        createUser: (_, { roomId, name, emoji }) => {
            const room = getRoom(roomId)
            room.users.push({ name, emoji, vote: undefined })
            updateRoom(room)
            return { name, emoji }
        },
        createRound: (_, {roomId, name, desc}) => {
            const room = getRoom(roomId)
            const round = { id: uuidv4(), name, desc }
            room.rounds.push(round)
            updateRoom(room)
            return round
        },
        startRound: (_, {roomId, id}) => {
            const room = getRoom(roomId)
            const round = room.rounds.find(round => round.id === id)
            if (!round) {
                throw new Error('That id is not found in this room.')
            }
            room.currentRoundId = id
            updateRoom(room)
            return id
        },
        endRound: (_, {roomId, points}) => {
            const room = getRoom(roomId)
            if (!room.currentRoundId) {
                throw new Error('No current round. Check room.currentRoundId')
            }
            const round = room.rounds.find(round => round.id === room.currentRoundId)
            if (!round) {
                throw new Error('The currentRoundId does not match a round in this room.')
            }
            round.points = points
            room.currentRoundId = undefined
            room.users.forEach(user=> user.vote = undefined)
            updateRoom(room)
            return round
        },
        vote: (_, {roomId, userName, points}) => {
            const room = getRoom(roomId)
            if (!room.currentRoundId) {
                throw new Error('No current round. Check room.currentRoundId')
            }
            const user = room.users.find(user => user.name === userName)
            if (!user) {
                throw new Error('User not found')
            }
            user.vote = points
            updateRoom(room)
            return points
        }
    }


}