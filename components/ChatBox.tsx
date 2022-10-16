import { useState } from "react";
import { useGlobalStore } from "../stores/globalStore";
import { msgUtils } from "../utils/messageUtils";

const ChatBox = () => {
  const messages = useGlobalStore((s) => s.messages);
  const localId = useGlobalStore((s) => s.localId);

  return (
    <div className="card border border-base-200 bg-base-100 flex-1 h-full shadow-lg">
      <h2 className="text-center text-xl font-semibold p-5 border-b border-base-200">
        Chat Box
      </h2>

      <div className="flex flex-1 flex-col h-full overflow-y-scroll py-5 p-5 bg-base-200">
        <div className="flex flex-1 flex-col">
          {messages.map((m, i) => {
            const isMine = m.owner === localId;

            const prevIndex = i - 1;
            const isPrevSameOwner =
              prevIndex >= 0 && messages[prevIndex].owner === m.owner;

            return (
              <div
                className={
                  "my-1 max-w-[80%] " +
                  (isMine ? "self-end text-right" : "self-start text-left")
                }
                key={m.id}
              >
                {!isPrevSameOwner && (
                  <div className="mx-2 mb-1 font-semibold">{m.owner}</div>
                )}
                <div
                  className={
                    "rounded-lg shadow-md px-2 py-1 " +
                    (isMine ? "bg-green-100 text-neutral" : "bg-base-100")
                  }
                >
                  {m.body}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-5 border-t border-base-300 w-full">
        <ChatInput />
      </div>
    </div>
  );
};

function ChatInput() {
  const [message, setMessage] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setMessage("");
        msgUtils.send(message);
      }}
    >
      <div className="flex">
        <input
          className="input input-bordered flex-1 bg-base-200"
          type="text"
          name="message"
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="btn ml-5">
          Send
        </button>
      </div>
    </form>
  );
}

export default ChatBox;
