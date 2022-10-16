import type { NextPage } from "next";
import dynamic from "next/dynamic";
import ChatBox from "../components/ChatBox";

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
        return peer ? <ConnectForm /> : <LocalIDForm />;

      case "connecting":
        return null;

      case "connected":
        return <ChatBox />;
    }
  };

  return (
    <div className="flex h-screen w-screen justify-center items-center bg-slate-50">
      {renderByStatus()}
    </div>
  );
};

export default Home;
