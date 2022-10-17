import { ChangeEventHandler, FormEventHandler } from "react";
import {
  sendConnEvent,
  useConnectionMachine,
} from "../machines/coreConnectionMachine";
import { useGlobalStore } from "../stores/globalStore";

const ConnectForm = () => {
  const remoteId = useGlobalStore((s) => s.remoteId);
  const isLoading = useConnectionMachine(
    (s) =>
      s.state.matches("connectingData") || s.state.matches("connectingAudio")
  );

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (!remoteId.trim()) return;

    sendConnEvent("CONNECT_DATA");
  };

  const onIdChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    useGlobalStore.setState({ remoteId: e.target.value });
  };

  return (
    <div className="card p-10 bg-neutral-content shadow-md prose">
      <h3 className="text-center">Enter Your Friend ID</h3>
      <form className="flex flex-col" onSubmit={onSubmit}>
        <input
          type="text"
          className="input input-bordered mt-5"
          placeholder="friend-id"
          onChange={onIdChange}
        />
        <button
          type="submit"
          className={"btn mt-5 " + (isLoading ? "loading" : "")}
        >
          Enter
        </button>
      </form>
    </div>
  );
};

export default ConnectForm;
