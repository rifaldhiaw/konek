import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";

const LocalVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    getUserMedia();
  }, []);

  const getUserMedia = () => {
    const constraints = {
      audio: true,
      video: { width: 1280, height: 720 },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((mediaStream) => {
        invariant(videoRef.current);
        videoRef.current.srcObject = mediaStream;

        videoRef.current.onloadedmetadata = () => {
          invariant(videoRef.current);
          videoRef.current.play();
        };
      })
      .catch((err) => {
        // always check for errors at the end.
        console.error(`${err.name}: ${err.message}`);
      });
  };

  return <video className="object-cover w-full h-full" ref={videoRef}></video>;
};

export default LocalVideo;
