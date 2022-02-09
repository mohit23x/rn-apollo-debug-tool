import { addPlugin } from "react-native-flipper";
import { initializeFlipperUtils } from "./initializeFlipperUtils";
import type { ApolloClientType } from "./typings";

export const flipperInit = (client: ApolloClientType) =>
  addPlugin({
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
