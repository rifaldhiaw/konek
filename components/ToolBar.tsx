import {
  sendAudioConnEvent,
  useAudioConnection,
} from "../machines/audioConnection/audioConnectionMachine";
import { useGlobalStore } from "../stores/globalStore";
import ActionButton from "./ActionButton";

const ToolBar = () => {
  const isChatBoxVisible = useGlobalStore((s) => s.isChatBoxVisible);
  const isVideoOn = useGlobalStore((s) => s.isVideoOn);
  const isAudioOn = useAudioConnection((s) =>
    s.state.matches("inCall.audioOn")
  );
  const isDarkMode = useGlobalStore((s) => s.isDarkMode);

  return (
    <div className="flex bg-base-100 p-4 justify-center">
      <ActionButton
        isOn={isDarkMode}
        icon="dark"
        onClick={() => {
          useGlobalStore.setState({ isDarkMode: !isDarkMode });
        }}
      />
      <div className="flex flex-1 justify-center">
        <ActionButton
          isOn={isVideoOn}
          icon="video"
          onClick={() => {
            useGlobalStore.setState({ isVideoOn: !isVideoOn });
          }}
        />
        <ActionButton
          isOn={isAudioOn}
          icon="audio"
          onClick={() => {
            if (isAudioOn) {
              sendAudioConnEvent("MUTE");
            } else {
              sendAudioConnEvent("UNMUTE");
            }
          }}
        />
      </div>
      <ActionButton
        isOn={isChatBoxVisible}
        icon="chat"
        onClick={() => {
          useGlobalStore.setState({ isChatBoxVisible: !isChatBoxVisible });
        }}
      />
    </div>
  );
};

export default ToolBar;
