import Peer, { DataConnection } from "peerjs";
import create from "zustand";

export type Message = {
  id: string;
  owner: string;
  status: "pending" | "succeed" | "failed";
  body: string;
};

type GloalStore = {
  localId: string;
  remoteId: string;
  peer: Peer | undefined;
  conn: DataConnection | undefined;
  status: "idle" | "connecting" | "connected";
  messages: Message[];
};

export const useGlobalStore = create<GloalStore>(() => ({
  localId: "",
  remoteId: "",
  peer: undefined,
  conn: undefined,
  status: "idle",
  messages: [],
}));
