import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { useGlobalStore } from "../stores/globalStore";

const LocalVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideoOn = useGlobalStore((s) => s.isVideoOn);
  const localVideo = useGlobalStore((s) => s.localVideo);

  useEffect(() => {
    if (isVideoOn) {
      getUserMedia();

      return () => {
        localVideo?.getTracks().forEach((v) => v.stop());
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVideoOn, localVideo]);

  const getUserMedia = () => {
    const constraints = {
      audio: false,
      video: { width: 1280, height: 720 },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((mediaStream) => {
        invariant(videoRef.current);
        videoRef.current.srcObject = mediaStream;
        useGlobalStore.setState({ localVideo: mediaStream });

        videoRef.current.onloadedmetadata = () => {
          invariant(videoRef.current);
          videoRef.current.play();
        };
      })
      .catch((err) => {
        // always check for errors at the end.
        console.error(`Video Player Err: ${err.name}: ${err.message}`);
      });
  };

  return <video className="object-cover w-full h-full" ref={videoRef}></video>;
};

export default LocalVideo;
