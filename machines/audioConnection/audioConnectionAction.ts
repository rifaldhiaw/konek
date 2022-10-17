import { MediaConnection } from "peerjs";
import invariant from "tiny-invariant";
import { useGlobalStore } from "../../stores/globalStore";
import {
  AudioConnectionContext,
  AudioConnectionEvents,
  sendAudioConnEvent,
} from "./audioConnectionMachine";

export const getUserMedia = () => {
  navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(
    (localStream) => {
      sendAudioConnEvent({
        type: "LOCAL_AUDIO_READY",
        localStream: localStream,
      });
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
    sendAudioConnEvent({ type: "CALL_RECEIVED", connection: call });

    call.on("stream", (remoteStream) => {
      sendAudioConnEvent({ type: "CONNECTED", remoteStream });
    });
  };

  state.peer.on("call", listener);
};

export const callUser = (
  context: AudioConnectionContext,
  event: AudioConnectionEvents
) => {
  const state = useGlobalStore.getState();
  invariant(state.peer);
  invariant(context.localStream);

  var call = state.peer.call(state.remoteId, context.localStream);

  sendAudioConnEvent({
    type: "CALL_USER_OK",
    connection: call,
  });

  call.on("stream", function (remoteStream) {
    sendAudioConnEvent({ type: "ANSWERED", remoteStream });
  });
};

export const answerCall = (
  context: AudioConnectionContext,
  event: AudioConnectionEvents
) => {
  invariant(context.localStream);
  if (event.type !== "CALL_RECEIVED") return;

  event.connection.answer(context.localStream);
};

export const muteAudio = (
  context: AudioConnectionContext,
  event: AudioConnectionEvents
) => {
  invariant(context.localStream);

  context.localStream.getAudioTracks().forEach((v) => (v.enabled = false));
};

export const unmuteAudio = (
  context: AudioConnectionContext,
  event: AudioConnectionEvents
) => {
  invariant(context.localStream);

  context.localStream.getAudioTracks().forEach((v) => (v.enabled = true));
};
