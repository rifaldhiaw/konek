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
  isMeCaller: boolean;
  peer: Peer | undefined;
  conn: DataConnection | undefined;
  status: "idle" | "connecting" | "connected";
  messages: Message[];
  isChatBoxVisible: boolean;
  isAudioOn: boolean;
  isVideoOn: boolean;
  isDarkMode: boolean;
  localVideo: MediaStream | undefined;
  localAudio: MediaStream | undefined;
  remoteVideo: MediaStream | undefined;
  remoteAudio: MediaStream | undefined;
  isConnectingAudio: boolean;
};

export const useGlobalStore = create<GloalStore>(() => ({
  localId: "",
  remoteId: "",
  isMeCaller: false,
  peer: undefined,
  conn: undefined,
  status: "idle",
  messages: [],
  isChatBoxVisible: true,
  isAudioOn: true,
  isVideoOn: false,
  isDarkMode: false,
  localVideo: undefined,
  localAudio: undefined,
  remoteVideo: undefined,
  remoteAudio: undefined,
  isConnectingAudio: false,
}));
