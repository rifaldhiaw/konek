import { NextPage } from "next";
import { useAudioConnection } from "../machines/audioConnection/audioConnectionMachine";
import { useDataConnection } from "../machines/dataConnection/dataConnectionMachine";
import { useGlobalStore } from "../stores/globalStore";
import ChatBox from "./ChatBox";
import ConnectForm from "./ConnectForm";
import LocalAudio from "./LocalAudio";
import LocalIDForm from "./LocalIDForm";
import LocalVideo from "./LocalVideo";
import RemoteAudio from "./RemoteAudio";
import ToolBar from "./ToolBar";

const Home: NextPage = () => {
  const isInCall = useDataConnection((s) => s.state.matches("connected"));

  const isDataIdle = useDataConnection((s) => s.state.matches("idle"));
  const isGettingUserMedia = useAudioConnection((s) =>
    s.state.matches("gettingUserMedia")
  );

  const isDarkMode = useGlobalStore((s) => s.isDarkMode);

  const renderByStatus = () => {
    if (isInCall) {
      return <Main />;
    }

    return (
      <div className="flex justify-center items-center flex-1">
        {isDataIdle || isGettingUserMedia ? <LocalIDForm /> : <ConnectForm />}
      </div>
    );
  };

  return (
    <div
      className="flex flex-col h-screen w-screen bg-base-300"
      data-theme={isDarkMode ? "dark" : "light"}
    >
      {renderByStatus()}
    </div>
  );
};

export const Main = () => {
  const isChatBoxVisible = useGlobalStore((s) => s.isChatBoxVisible);
  const isVideoOn = useGlobalStore((s) => s.isVideoOn);

  const video = (
    <div className="flex flex-1 h-0">
      <div className="flex flex-1 rounded-3xl shadow bg-base-100 p-2">
        <div className="card h-full w-full">
          <div className="absolute shadow-xl text-white bottom-2 left-5">
            Rifaldhi AW
          </div>
          <LocalVideo />
        </div>
      </div>
    </div>
  );

  const videoPlaceholder = (
    <div className="flex flex-1 h-0">
      <div className="flex flex-1 rounded-3xl shadow bg-base-100 p-2">
        <div className="card h-full w-full">
          <div className="h-full flex justify-center items-center bottom-2 left-5 text-lg ">
            <div className="avatar placeholder">
              <div className="bg-base-300 rounded-full w-24">
                <span className="text-3xl font-semibold">US</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="flex flex-1 h-0 ml-5 justify-between">
        <div className="relative flex flex-1 flex-col items-stretch pr-5 max-w-3xl mx-auto">
          <div className="h-5" />
          {videoPlaceholder}
          <div className="h-3" />
          {videoPlaceholder}
          <div className="h-5" />
        </div>

        {isChatBoxVisible && (
          <div className="w-[400px] h-full py-5">
            <ChatBox />
          </div>
        )}
      </div>

      <LocalAudio />
      <RemoteAudio />

      <ToolBar />
    </div>
  );
};

export default Home;
