import {pubsub} from "../pubsub.js";

let currentNumber = 0;

export const resolvers = {
    Subscription: {
        counterChanged: {
            subscribe: () => pubsub.asyncIterator(["NUMBER_INCREMENTED"])
        }
    },
    Query: {
        counter:
            () => currentNumber
    },
    Mutation: {
        incrementCounter: () => {
            currentNumber++;
            return pubsub.publish('NUMBER_INCREMENTED', { counterChanged: currentNumber });
        }

    }


}