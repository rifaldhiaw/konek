import { MediaConnection } from "peerjs";
import invariant from "tiny-invariant";
import { useGlobalStore } from "../../stores/globalStore";
import { sendAudioConnEvent } from "./audioConnectionMachine";

export const getUserMedia = () => {
  navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(
    (localStream) => {
      useGlobalStore.setState({ localAudio: localStream });
      sendAudioConnEvent("LOCAL_AUDIO_READY");
    },
    (err) => {
      sendAudioConnEvent("FAILED_GET_LOCAL_AUDIO");
      console.error("Failed to get local stream", err);
    }
  );
};

export const setupConnectionListener = () => {
  const state = useGlobalStore.getState();
  invariant(state.peer);

  const listener = (call: MediaConnection) => {
    useGlobalStore.setState({ audioCall: call });
    sendAudioConnEvent("CALL_RECEIVED");

    call.on("stream", (remoteStream) => {
      console.log("waiter rec stream", remoteStream);
      sendAudioConnEvent("CONNECTED");
      useGlobalStore.setState({ remoteAudio: remoteStream });
    });
  };

  state.peer.on("call", listener);
};

export const callUser = () => {
  const state = useGlobalStore.getState();
  invariant(state.peer);
  invariant(state.localAudio);

  var call = state.peer.call(state.remoteId, state.localAudio);
  useGlobalStore.setState({ audioCall: call });

  call.on("stream", function (remoteStream) {
    console.log("caller rec stream", remoteStream);
    sendAudioConnEvent("CONNECTED");
    useGlobalStore.setState({ remoteAudio: remoteStream });
  });
};

export const answerCall = () => {
  const state = useGlobalStore.getState();
  invariant(state.audioCall);
  invariant(state.localAudio);

  state.audioCall.answer(state.localAudio);
};

export const muteAudio = () => {
  const state = useGlobalStore.getState();
  invariant(state.localAudio);

  state.localAudio.getAudioTracks().forEach((v) => (v.enabled = false));
};

export const unmuteAudio = () => {
  const state = useGlobalStore.getState();
  invariant(state.localAudio);

  state.localAudio.getAudioTracks().forEach((v) => (v.enabled = true));
};
