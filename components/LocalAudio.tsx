import { useEffect } from "react";
import { useGlobalStore } from "../stores/globalStore";

const LocalAudio = () => {
  const isAudioOn = useGlobalStore((s) => s.isAudioOn);
  const localAudio = useGlobalStore((s) => s.localAudio);

  // Enabled / Disabled Audio
  useEffect(() => {
    if (!!localAudio) {
      localAudio.getAudioTracks().forEach((v) => (v.enabled = isAudioOn));
    }
  }, [isAudioOn, localAudio]);

  return null;
};

export default LocalAudio;
