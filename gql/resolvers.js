import {pubsub} from "../pubsub.js";
import { v4 as uuidv4 } from 'uuid';
let currentNumber = 0;

let rooms = [{
    "id": "d4a351f2-a218-4fe2-9ebd-8473b6e1ec76",
    "name": "Chad's test room"
}]

export const resolvers = {
    Subscription: {
        counterChanged: {
            subscribe: () => pubsub.asyncIterator(["NUMBER_INCREMENTED"])
        },
        roomUpdated: {
            subscribe: () => pubsub.asyncIterator(["ROOM_UPDATED"])
        }
    },
    Query: {
        counter: () => currentNumber,
        roomState: (_, {id}) => {
            return rooms.find(room => room.id === id) || null
        },
        allRooms: () => {
            return rooms
        }
    },
    Mutation: {
        incrementCounter: () => {
            currentNumber++;
            pubsub.publish('NUMBER_INCREMENTED', { counterChanged: currentNumber });
            return currentNumber
        },
        createRoom: (_, { name }) => {
            const room = {
                id: uuidv4(),
                name
            }
            rooms.push(room)
            return room
        },
        updateName: (_, {id, name}) => {
            const room = rooms.find(room => room.id === id)
            if (!room) {
                return null
            }
            room.name = name
            pubsub.publish('ROOM_UPDATED', { roomUpdated: room })
            return room
        },
    }


}