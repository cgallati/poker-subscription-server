import {pubsub} from "../pubsub.js";

let currentNumber = 0;

let rooms = []

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
        roomState: (id) => {
            return rooms.find(room => room.id === id)
        }
    },
    Mutation: {
        incrementCounter: () => {
            currentNumber++;
            return pubsub.publish('NUMBER_INCREMENTED', { counterChanged: currentNumber });
        },
        createRoom: (name) => {
            const room = {
                id: uuid.v1(),
                name
            }
            rooms.push(room)
            return room.id
        },
        updateName: (id, name) => {
            const room = rooms.find(room => room.id === id)
            room.name = name
            return pubsub.publish('ROOM_UPDATED', {roomUpdated: room})

        }
    }


}