import { useGlobalStore } from "../stores/globalStore";
import ActionButton from "./ActionButton";

const ToolBar = () => {
  const isChatBoxVisible = useGlobalStore((s) => s.isChatBoxVisible);
  const isVideoOn = useGlobalStore((s) => s.isVideoOn);
  const isAudioOn = useGlobalStore((s) => s.isAudioOn);
  const isDarkMode = useGlobalStore((s) => s.isDarkMode);

  return (
    <div className="flex bg-white p-4 justify-center">
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
            useGlobalStore.setState({ isAudioOn: !isAudioOn });
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
