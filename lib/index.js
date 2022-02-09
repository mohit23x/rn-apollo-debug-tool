import { addPlugin } from "react-native-flipper";
import { initializeFlipperUtils } from "./initializeFlipperUtils";
export const flipperInit = (client) => addPlugin({
    getId() {
        return "flipper-test";
    },
    onConnect(connection) {
        console.log("apollo:connecteed");
        initializeFlipperUtils(connection, client);
    },
    onDisconnect() {
        console.log("apollo:disconnected");
    },
});
