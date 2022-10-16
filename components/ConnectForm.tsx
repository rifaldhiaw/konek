import { ChangeEventHandler, FormEventHandler } from "react";
import invariant from "tiny-invariant";
import { Message, useGlobalStore } from "../stores/globalStore";
import { msgUtils } from "../utils/messageUtils";

const ConnectForm = () => {
  const remoteId = useGlobalStore((s) => s.remoteId);
  const peer = useGlobalStore((s) => s.peer);

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (!remoteId.trim()) return;

    invariant(peer);
    const conn = peer.connect(remoteId);
    useGlobalStore.setState({ conn });

    conn.on("data", (data) => {
      msgUtils.receive(data as Message);
    });

    conn.on("open", () => {
      useGlobalStore.setState({ status: "connected" });
    });
  };

  const onIdChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    useGlobalStore.setState({ remoteId: e.target.value });
  };

  return (
    <div className="card p-10 bg-white shadow-md prose">
      <h3 className="text-center">Enter Your Friend ID</h3>
      <form className="flex flex-col" onSubmit={onSubmit}>
        <input
          type="text"
          className="input input-bordered mt-5"
          placeholder="friend-id"
          onChange={onIdChange}
        />
        <button type="submit" className="btn mt-5">
          Enter
        </button>
      </form>
    </div>
  );
};

export default ConnectForm;
