import { nanoid } from "nanoid";
import { Message, useGlobalStore } from "../stores/globalStore";

type ConfirmedMessage = { id: string; status: "succeed" };

const send = (msgBody: string) => {
  const state = useGlobalStore.getState();
  const msg: Message = {
    id: nanoid(),
    owner: state.localId,
    body: msgBody,
    status: "pending",
  };
  useGlobalStore.setState({ messages: [...state.messages, msg] });

  state.conn?.send(msg);
};

const receive = (msg: Message | ConfirmedMessage) => {
  const state = useGlobalStore.getState();

  const messages = (() => {
    if (msg.status === "pending") {
      new Audio("./pop.mp3").play();

      // Confirm msg received
      const confirmedMessage: ConfirmedMessage = {
        id: msg.id,
        status: "succeed",
      };
      state.conn?.send(confirmedMessage);

      const msgObjUpdated: Message = { ...msg, status: "succeed" };
      return [...state.messages, msgObjUpdated];
    }

    if (msg.status === "succeed") {
      return state.messages.map((m) =>
        m.id === msg.id ? ({ ...m, status: "succeed" } as Message) : m
      );
    }
  })();

  useGlobalStore.setState({ messages });
};

export const msgUtils = { send, receive };
