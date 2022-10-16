import AudioOff from "../icons/AudioOff";
import AudioOn from "../icons/AudioOn";
import ChatOn from "../icons/ChatOn";
import DarkModeOff from "../icons/DarkModeOff";
import DarkModeOn from "../icons/DarkModeOn";
import VideoOff from "../icons/VideoOff";
import VideoOn from "../icons/VideoOn";

const ActionButton = (props: {
  isOn: boolean;
  icon: "audio" | "video" | "chat" | "dark";
  onClick: () => void;
}) => {
  const iconJsx = (() => {
    switch (props.icon) {
      case "audio":
        return (
          <>
            <AudioOn />
            <AudioOff />
          </>
        );
      case "video":
        return (
          <>
            <VideoOn />
            <VideoOff />
          </>
        );
      case "chat":
        return <ChatOn />;

      case "dark":
        return (
          <>
            <DarkModeOff />
            <DarkModeOn />
          </>
        );
    }
  })();

  return (
    <label
      className={
        "btn btn-circle swap mx-2 " + (props.isOn ? "" : "btn-outline")
      }
    >
      <input
        type="checkbox"
        defaultChecked={props.isOn}
        onChange={props.onClick}
      />
      {iconJsx}
    </label>
  );
};

export default ActionButton;
