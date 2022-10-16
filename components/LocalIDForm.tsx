import Peer from "peerjs";
import { ChangeEventHandler, FormEventHandler } from "react";
import { Message, useGlobalStore } from "../stores/globalStore";
import { msgUtils } from "../utils/messageUtils";

const LocalIDForm = () => {
  const localId = useGlobalStore((s) => s.localId);

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (!localId) return;

    const peer = new Peer(localId);
    useGlobalStore.setState({ peer });

    peer.on("connection", (conn) => {
      useGlobalStore.setState({ conn });

      conn.on("data", (data) => {
        msgUtils.receive(data as Message);
      });

      conn.on("open", () => {
        useGlobalStore.setState({ status: "connected" });
      });
    });
  };

  const onIdChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    useGlobalStore.setState({ localId: e.target.value });
  };

  return (
    <div className="card p-10 bg-neutral-content shadow-md prose">
      <h3 className="text-center">Enter Your Unique ID</h3>
      <form className="flex flex-col" onSubmit={onSubmit}>
        <input
          type="text"
          className="input input-bordered mt-5"
          placeholder="my-unique-id"
          onChange={onIdChange}
        />
        <button type="submit" className="btn mt-5">
          Enter
        </button>
      </form>
    </div>
  );
};

export default LocalIDForm;
