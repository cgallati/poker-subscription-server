// In the background, increment a number every second and notify subscribers when
// it changes.
import {pubsub} from "./pubsub.js";

let currentNumber = 0;
export function incrementNumber() {
    currentNumber++;
    pubsub.publish("NUMBER_INCREMENTED", { counterChanged: currentNumber });
    setTimeout(incrementNumber, 1000);
}
