import Peer, { DataConnection, MediaConnection } from "peerjs";
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
  audioCall: MediaConnection | undefined;
  messages: Message[];
  isChatBoxVisible: boolean;
  isVideoOn: boolean;
  isDarkMode: boolean;
  localVideo: MediaStream | undefined;
  localAudio: MediaStream | undefined;
  remoteVideo: MediaStream | undefined;
  remoteAudio: MediaStream | undefined;
};

export const useGlobalStore = create<GloalStore>(() => ({
  localId: "",
  remoteId: "",
  peer: undefined,
  conn: undefined,
  audioCall: undefined,
  messages: [],
  isChatBoxVisible: true,
  isVideoOn: false,
  isDarkMode: false,
  localVideo: undefined,
  localAudio: undefined,
  remoteVideo: undefined,
  remoteAudio: undefined,
}));
