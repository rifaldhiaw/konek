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
  isChatBoxVisible: boolean;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isDarkMode: boolean;
};

export const useGlobalStore = create<GloalStore>(() => ({
  localId: "",
  remoteId: "",
  peer: undefined,
  conn: undefined,
  status: "idle",
  messages: [],
  isChatBoxVisible: true,
  isVideoOn: false,
  isAudioOn: false,
  isDarkMode: false,
}));
