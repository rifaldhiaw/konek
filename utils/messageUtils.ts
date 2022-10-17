import { nanoid } from "nanoid";
import { Message, useGlobalStore } from "../stores/globalStore";

type ConfirmedMessage = { id: string; status: "succeed" };

const send = (msgBody: string) => {
  const store = useGlobalStore.getState();
  const msg: Message = {
    id: nanoid(),
    owner: store.localId,
    body: msgBody,
    status: "pending",
  };
  useGlobalStore.setState({ messages: [...store.messages, msg] });

  store.conn?.send(msg);
};

const receive = (msg: Message | ConfirmedMessage) => {
  const store = useGlobalStore.getState();

  const messages = (() => {
    if (msg.status === "pending") {
      new Audio("./pop.mp3").play();

      // Confirm msg received
      const confirmedMessage: ConfirmedMessage = {
        id: msg.id,
        status: "succeed",
      };
      store.conn?.send(confirmedMessage);

      const msgObjUpdated: Message = { ...msg, status: "succeed" };
      return [...store.messages, msgObjUpdated];
    }

    if (msg.status === "succeed") {
      return store.messages.map((m) =>
        m.id === msg.id ? ({ ...m, status: "succeed" } as Message) : m
      );
    }
  })();

  useGlobalStore.setState({ messages });
};

export const msgUtils = { send, receive };
