import { ChangeEventHandler, FormEventHandler } from "react";
import {
  sendAudioConnEvent,
  useAudioConnection,
} from "../machines/audioConnection/audioConnectionMachine";
import {
  sendDataConnEvent,
  useDataConnection,
} from "../machines/dataConnection/dataConnectionMachine";
import { useGlobalStore } from "../stores/globalStore";

const ConnectForm = () => {
  const remoteId = useGlobalStore((s) => s.remoteId);
  const isDataConnecting = useDataConnection((s) =>
    s.state.matches("connectingToRemoteUser")
  );
  const isCallingUser = useAudioConnection((s) =>
    s.state.matches("callingUser")
  );

  const isLoading = isDataConnecting || isCallingUser;

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (!remoteId.trim()) return;

    sendDataConnEvent("CONNECT_TO_USER");
    sendAudioConnEvent("CALL_USER");
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
