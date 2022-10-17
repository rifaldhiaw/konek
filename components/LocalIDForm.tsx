import { ChangeEventHandler, FormEventHandler } from "react";
import { sendAudioConnEvent } from "../machines/audioConnection/audioConnectionMachine";
import { sendDataConnEvent } from "../machines/dataConnection/dataConnectionMachine";
import { useGlobalStore } from "../stores/globalStore";

const LocalIDForm = () => {
  const localId = useGlobalStore((s) => s.localId);

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    if (!localId) return;

    sendDataConnEvent("START");
    sendAudioConnEvent("START");
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
        <button type="submit" className="btn mt-5 ">
          Enter
        </button>
      </form>
    </div>
  );
};

export default LocalIDForm;
