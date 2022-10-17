import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { useAudioConnection } from "../machines/audioConnection/audioConnectionMachine";

const RemoteAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const remoteAudio = useAudioConnection((s) => s.state.context.remoteStream);

  // Get Local Audio Stream
  useEffect(() => {
    if (!!remoteAudio) {
      invariant(audioRef.current);
      audioRef.current.srcObject = remoteAudio;

      audioRef.current.onloadedmetadata = () => {
        invariant(audioRef.current);
        audioRef.current.play();
      };
    }
  }, [remoteAudio]);

  return <audio autoPlay={true} className="hidden" ref={audioRef}></audio>;
};

export default RemoteAudio;
