import type { NextPage } from "next";
import dynamic from "next/dynamic";
import ChatBox from "../components/ChatBox";
import LocalVideo from "../components/LocalVideo";

import { useGlobalStore } from "../stores/globalStore";
const LocalIDForm = dynamic(() => import("../components/LocalIDForm"), {
  ssr: false,
});
const ConnectForm = dynamic(() => import("../components/ConnectForm"), {
  ssr: false,
});

const Home: NextPage = () => {
  const peer = useGlobalStore((s) => s.peer);
  const status = useGlobalStore((s) => s.status);

  const renderByStatus = () => {
    switch (status) {
      case "idle":
        return (
          <div className="flex justify-center items-center flex-1">
            {peer ? <ConnectForm /> : <LocalIDForm />}
          </div>
        );

      case "connecting":
        return null;

      case "connected":
        return <Main />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100">
      {renderByStatus()}
    </div>
  );
};

export const Main = () => {
  const video = (
    <div className="flex flex-1 h-0 max-w-xl">
      <div className="flex flex-1 rounded-3xl shadow bg-white p-2">
        <div className="card h-full w-full">
          <div className="absolute shadow-xl text-white bottom-2 left-5">
            Rifaldhi AW
          </div>
          <LocalVideo />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 h-0 ml-5">
      <div className="relative flex flex-1 flex-col items-center pr-20">
        <div className="h-5" />
        {video}
        <div className="h-3" />
        {video}
        <div className="h-5" />

        <div className="w-14 h-full flex items-center absolute right-0 ">
          <div className="w-full h-[400px] rounded-tl-3xl rounded-bl-3xl border border-slate-200 shadow bg-white"></div>
        </div>
      </div>

      <div className="w-[400px] h-full py-5">
        <ChatBox />
      </div>
    </div>
  );
};

export default Home;
