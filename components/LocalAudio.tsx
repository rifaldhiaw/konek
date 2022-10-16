import { MediaConnection } from "peerjs";
import { memo, useEffect } from "react";
import invariant from "tiny-invariant";
import { useGlobalStore } from "../stores/globalStore";

const constraint = { video: false, audio: true };

const LocalAudio = () => {
  const isMeCaller = useGlobalStore((s) => s.isMeCaller);
  const remoteId = useGlobalStore((s) => s.remoteId);
  const peer = useGlobalStore((s) => s.peer);
  const isAudioOn = useGlobalStore((s) => s.isAudioOn);
  const localAudio = useGlobalStore((s) => s.localAudio);

  // Get Local Audio Stream, Init call
  useEffect(() => {
    if (!isMeCaller || useGlobalStore.getState().isConnectingAudio) return;

    // Somehow thie component re-render twice
    useGlobalStore.setState({ isConnectingAudio: true });

    navigator.mediaDevices
      .getUserMedia(constraint)
      .then((localStream) => {
        useGlobalStore.setState({ localAudio: localStream });

        invariant(peer);
        var call = peer.call(remoteId, localStream);
        call.on("stream", function (remoteStream) {
          useGlobalStore.setState({ remoteAudio: remoteStream });
        });
      })
      .catch((err) => {
        // always check for errors at the end.
        console.error(`Audio Player Err: ${err.name}: ${err.message}`);
      });

    return () => {
      localAudio?.getTracks().forEach((v) => v.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get Local Audio Stream, Answer Call
  useEffect(() => {
    invariant(peer);

    const listener = (call: MediaConnection) => {
      navigator.mediaDevices.getUserMedia(constraint).then(
        (localStream) => {
          useGlobalStore.setState({ localAudio: localStream });

          call.answer(localStream);
          call.on("stream", (remoteStream) => {
            useGlobalStore.setState({ remoteAudio: remoteStream });
          });
        },
        (err) => {
          console.error("Failed to get local stream", err);
        }
      );
    };

    peer.on("call", listener);

    return () => {
      peer.off("call", listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Enabled / Disabled Audio
  useEffect(() => {
    if (!!localAudio) {
      localAudio.getAudioTracks().forEach((v) => (v.enabled = isAudioOn));
    }
  }, [isAudioOn, localAudio]);

  return null;
};

const LocalAudioMemo = memo(LocalAudio);

export default LocalAudioMemo;
