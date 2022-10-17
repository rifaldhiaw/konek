import { createMachine } from "xstate";
import create from "zustand";
import xstate from "zustand-middleware-xstate";
import { connectRemoteUser, initPeer } from "./dataConnectionAction";

export type DataConnectionContext = {};

export type DataConnectionEvents =
  | { type: "START" }
  | { type: "CONNECT_TO_USER" }
  | { type: "CONNECTION_OPEN" };

export type DataConnectionStates = {
  value: "idle" | "starting" | "connectingToRemoteUser" | "connected";
  context: DataConnectionContext;
};

const dataConnectionMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QQIYBcUGED2A7XYAxmgJZ4B0JEANmAMQDKAKgIIBKTA2gAwC6ioAA7ZYJUngEgAHogCcADnIBWACwBGJQHZN81QCY987moA0IAJ6I18tcrVqAbLMebZAZnlvZegL4+zqBg4+ETiuOSwGABOpLhQdJgA8gByyQCimEwA+kyJWQCqDGlsPPxIIMKiYZIyCG4qbuRuhmrc8rKaKkqt3G5mlgjyeuSyo6NKDtpOeiryfgHoWHgExGThkSgxJHEJKemZAJIpWYkACmnJpZKVYms1iPWNzTZtHV09fRaIetwq5CpjZw-BwOXq6eYgQJLEKrCiEZahbZQJjYNhgAC22DQYHysDAUV2qQyTCOyRO50ufGuIluEnKtVcmnInQMak0HlB3D0mn6cj+7Ic8nkDg0rk84IhuGwEDgkihwRWYUoNDA1Kqd3piAAtNZmXolMYPB12TYOryED8-oCgdwQWClBD5QjYetorEoGrabh7hb6uQ1CpuEpZFo2io9Oa1Aomm5Y3pQW5etxkypHYsFYi4c73Si0Zjsbj8Z7qpqEEoJuRfuzNG15JoDENzbJ+W4nG0QTp9Vo00Fs2tyPCYdiIMWNaBaq1w+QHIZ2g4vF0HOHzZaRoC1MCExKFr2h2OKjSS+PtSC9Qa1EbtB4I18EFqlGuxtz2rIZ9x3H4-EA */
  createMachine<
    DataConnectionContext,
    DataConnectionEvents,
    DataConnectionStates
  >(
    {
      context: {},
      predictableActionArguments: true,
      id: "dataConnection",
      initial: "idle",
      states: {
        idle: {
          on: {
            START: {
              target: "starting",
              actions: "initPeer",
            },
          },
        },
        starting: {
          on: {
            CONNECT_TO_USER: {
              target: "connectingToRemoteUser",
              actions: "connectRemoteUser",
            },
            CONNECTION_OPEN: {
              target: "connected",
            },
          },
        },
        connectingToRemoteUser: {
          on: {
            CONNECTION_OPEN: {
              target: "connected",
            },
          },
        },
        connected: {},
      },
    },
    {
      actions: {
        initPeer,
        connectRemoteUser,
      },
    }
  );

export const useDataConnection = create(xstate(dataConnectionMachine));

export const sendDataConnEvent = useDataConnection.getState().send;
