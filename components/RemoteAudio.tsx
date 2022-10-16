import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { useGlobalStore } from "../stores/globalStore";

const RemoteAudio = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const remoteAudio = useGlobalStore((s) => s.remoteAudio);

  // Get Local Audio Stream
  useEffect(() => {
    if (!!remoteAudio) {
      invariant(audioRef.current);
      audioRef.current.srcObject = remoteAudio;

      audioRef.current.onloadedmetadata = () => {
        invariant(audioRef.current);
        audioRef.current.play();
      };

      return () => {
        remoteAudio.getAudioTracks().forEach((v) => v.stop());
      };
    }
  }, [remoteAudio]);

  return <audio autoPlay={true} className="hidden" ref={audioRef}></audio>;
};

export default RemoteAudio;
