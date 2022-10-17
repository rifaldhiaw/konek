import "iconify-icon";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import ChatBox from "../components/ChatBox";
import LocalAudio from "../components/LocalAudio";
import LocalVideo from "../components/LocalVideo";
import RemoteAudio from "../components/RemoteAudio";
import ToolBar from "../components/ToolBar";

import { useGlobalStore } from "../stores/globalStore";
const LocalIDForm = dynamic(() => import("../components/LocalIDForm"), {
  ssr: false,
});
const ConnectForm = dynamic(() => import("../components/ConnectForm"), {
  ssr: false,
});

const Home: NextPage = () => {
  const machineState = useGlobalStore((s) => s.machineState);
  const isDarkMode = useGlobalStore((s) => s.isDarkMode);

  useEffect(() => {
    import("../machines/coreConnectionMachine").then((o) => {
      o.coreConnectionService.start();
    });
  }, []);

  const renderByStatus = () => {
    if (machineState === "inCall") {
      return <Main />;
    }

    return (
      <div className="flex justify-center items-center flex-1">
        {machineState === "waitingLocalId" ? <LocalIDForm /> : <ConnectForm />}
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
