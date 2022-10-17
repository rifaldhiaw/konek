import Peer, { DataConnection } from "peerjs";
import create from "zustand";
import { CoreConnectionState } from "../machines/coreConnectionMachine";

export type Message = {
  id: string;
  owner: string;
  status: "pending" | "succeed" | "failed";
  body: string;
};

type GloalStore = {
  machineState: CoreConnectionState;
  localId: string;
  remoteId: string;
  peer: Peer | undefined;
  conn: DataConnection | undefined;
  messages: Message[];
  isChatBoxVisible: boolean;
  isAudioOn: boolean;
  isVideoOn: boolean;
  isDarkMode: boolean;
  localVideo: MediaStream | undefined;
  localAudio: MediaStream | undefined;
  remoteVideo: MediaStream | undefined;
  remoteAudio: MediaStream | undefined;
};

export const useGlobalStore = create<GloalStore>(() => ({
  machineState: "waitingLocalId",
  localId: "",
  remoteId: "",
  peer: undefined,
  conn: undefined,
  messages: [],
  isChatBoxVisible: true,
  isAudioOn: true,
  isVideoOn: false,
  isDarkMode: false,
  localVideo: undefined,
  localAudio: undefined,
  remoteVideo: undefined,
  remoteAudio: undefined,
}));
