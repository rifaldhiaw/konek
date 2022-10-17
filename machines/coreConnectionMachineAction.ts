import Peer, { MediaConnection } from "peerjs";
import invariant from "tiny-invariant";
import { Message, useGlobalStore } from "../stores/globalStore";
import { msgUtils } from "../utils/messageUtils";
import { sendConnEvent } from "./coreConnectionMachine";

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
      sendConnEvent({ type: "DATA_CONNECTED" });
    });
  });
};

export const connectData = () => {
  const state = useGlobalStore.getState();

  invariant(state.peer);
  const conn = state.peer.connect(state.remoteId);
  useGlobalStore.setState({ conn });

  conn.on("data", (data) => {
    msgUtils.receive(data as Message);
  });

  conn.on("open", () => {
    sendConnEvent({ type: "DATA_CONNECTED" });
  });
};

export const callAudio = () => {
  const state = useGlobalStore.getState();

  navigator.mediaDevices
    .getUserMedia({ video: false, audio: true })
    .then((localStream) => {
      useGlobalStore.setState({ localAudio: localStream });

      invariant(state.peer);
      var call = state.peer.call(state.remoteId, localStream);

      call.on("stream", function (remoteStream) {
        sendConnEvent({ type: "AUDIO_CONNECTED" });
        useGlobalStore.setState({ remoteAudio: remoteStream });
      });
    })
    .catch((err) => {
      // always check for errors at the end.
      console.error(`Audio Player Err: ${err.name}: ${err.message}`);
    });
};

export const setupAudioConnectionListener = () => {
  const listener = (call: MediaConnection) => {
    navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(
      (localStream) => {
        useGlobalStore.setState({ localAudio: localStream });

        call.answer(localStream);
        call.on("stream", (remoteStream) => {
          sendConnEvent({ type: "AUDIO_CONNECTED" });
          useGlobalStore.setState({ remoteAudio: remoteStream });
        });
      },
      (err) => {
        console.error("Failed to get local stream", err);
      }
    );
  };

  const state = useGlobalStore.getState();
  invariant(state.peer);
  state.peer.on("call", listener);
};
