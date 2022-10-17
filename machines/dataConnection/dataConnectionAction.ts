import Peer from "peerjs";
import invariant from "tiny-invariant";
import { Message, useGlobalStore } from "../../stores/globalStore";
import { msgUtils } from "../../utils/messageUtils";
import { sendDataConnEvent } from "./dataConnectionMachine";

export const initPeer = () => {
  const state = useGlobalStore.getState();

  const peer = new Peer(state.localId);
  useGlobalStore.setState({ peer });

  peer.on("connection", (conn) => {
    useGlobalStore.setState({ conn });

    conn.on("data", (data) => {
      msgUtils.receive(data as Message);
    });

    conn.on("open", () => {
      sendDataConnEvent("CONNECTION_OPEN");
    });
  });
};

export const connectRemoteUser = () => {
  const state = useGlobalStore.getState();

  invariant(state.peer);
  const conn = state.peer.connect(state.remoteId);
  useGlobalStore.setState({ conn });

  conn.on("data", (data) => {
    msgUtils.receive(data as Message);
  });

  conn.on("open", () => {
    sendDataConnEvent("CONNECTION_OPEN");
  });
};
