import { createMachine } from "xstate";
import create from "zustand";
import xstate from "zustand-middleware-xstate";
import {
  answerCall,
  callUser,
  getUserMedia,
  muteAudio,
  setupConnectionListener,
  unmuteAudio,
} from "./audioConnectionAction";

export type AudioConnectionContext = {};

export type AudioConnectionEvents =
  | { type: "START" }
  | { type: "FAILED_GET_LOCAL_AUDIO" }
  | { type: "LOCAL_AUDIO_READY" }
  | { type: "CALL_USER" }
  | { type: "CALL_RECEIVED" }
  | { type: "ANSWERED" }
  | { type: "CONNECTED" }
  | { type: "MUTE" }
  | { type: "UNMUTE" };

export type AudioConnectionStates = {
  value:
    | "idle"
    | "gettingUserMedia"
    | "ready"
    | "callingUser"
    | "answering"
    | "inCall.audioOn"
    | "inCall.audioOff";
  context: AudioConnectionContext;
};

const audioConnectionMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7AwlgdvmAMYAu2+AdBhADZgDEAygCoCCASiwNoAMAuolAAHLLAzkCQkAA9EAWgDsvAMyUAjMoBsAJi3r1vACwBWRUYA0IAJ6ItRygE5HJgBy8XJoysU7eWgF8AqzRMXAIiMgpKGFJyfCgAVVgwACcAWUgMZAYAGQB5HDZcgH02RIARAEl8ko4AUTYKgE0+QSQQUXFJfGk5BHkVXh1KI0ctRxV1M0dzRVcrWwR7Jxd3T29fVSCQ9Gw8QhIemLA4jATktMzMHIAxNirc+oqSgHF6lhKCotLy6vy2tIuhIKH0FOYTJRfCYhuoJu5XDDFohNFpKB5HK4tGYtIj7K5XDsQKF9hEjtFUmBkBBrAwfqVEkx6hxAR1gT0wQh1K4HKpzNy4WYTC4VMiuSYRvo4bxBd4jAYiSTwocogRKJTqbT6XV6jh6lUAGrPVkiMQgqQdfpwtETFRaeGKdQ6dzGMVGVzolQ6RS+H3zaa8RSKvbKyLHYjIWi0c5JFKpBhsAByTAA6szjQIgWaOZa7FpeBodO7FEMjPDXDoxZo1FjvAYSyYMdjg2EDmHosh8LAAO5pGN0-KJxO6lgZ9qm7qg3PLfOUVyOQPunQ6L06Mxin3o5T14Urwy8Ewt0kq47nHCR2iUJX5fAMdKJUcmzrZqegK2qNT+Ez2FRTLRDRxKxsFFXDUFcK00NwjB0AUj1Dck1TPC8rxDfIADM0IYRJE3vR9MzZF8LTfFFhgccYZXcMZuUcbkxXkJ1KCLbFZn0VQaMmIJghAfAsAgOBpCVNsEKoGh6CzSciNkBR3EhMYjHkyZlyMA8xQJUYeUMO0vTcFQTHUOChNVKhYniWMriyZBxPNXpp3kPSPRMCVeEDL1nI8SxgIQNT3XlHRnAUvS4QMskjPVKkaSsnNiIGbkNAlNd1BomEaPkoClm8jTVH-NdQMPLjBJC8MLxjS5Uki18pIQCU1HUL1lEc3wjHmBZPLhD1lJ8KZlEUSZFDy3ZW0Kjsu17VIY3KyT+hhT9JnnBtUtxDdFEoMwZTtH0630friRDQzT3wc8oxQsIbwmmzopokYJWxOEpnItwq2cucepUUwDGMRR8yMYKT2iJCjuvDCzs5AxZ10dxlGcyYnRMR61B8SY3sMJqvp+9tEIOi9genWsVr0PT-0S-MHs8+iZUYssvq0H1NFq7aCt+yT2Qq-p5ERNQ5IU1dlNh0nEoLJipXMFQXEDPKgiAA */
  createMachine<
    AudioConnectionContext,
    AudioConnectionEvents,
    AudioConnectionStates
  >(
    {
      context: {},
      predictableActionArguments: true,
      id: "audioConnection",
      initial: "idle",
      states: {
        idle: {
          on: {
            START: {
              target: "gettingUserMedia",
              actions: "getUserMedia",
            },
          },
        },
        gettingUserMedia: {
          on: {
            LOCAL_AUDIO_READY: {
              target: "ready",
              actions: "setupConnectionListener",
            },
            FAILED_GET_LOCAL_AUDIO: {
              target: "idle",
            },
          },
        },
        ready: {
          on: {
            CALL_USER: {
              target: "callingUser",
              actions: "callUser",
            },
            CALL_RECEIVED: {
              target: "answering",
              actions: "answerCall",
            },
          },
        },
        callingUser: {
          on: {
            ANSWERED: {
              target: "inCall",
            },
          },
        },
        answering: {
          on: {
            CONNECTED: {
              target: "inCall",
            },
          },
        },
        inCall: {
          initial: "audioOn",
          states: {
            audioOn: {
              on: {
                MUTE: {
                  target: "audioOff",
                  actions: "muteAudio",
                },
              },
            },
            audioOff: {
              on: {
                UNMUTE: {
                  target: "audioOn",
                  actions: "unmuteAudio",
                },
              },
            },
          },
        },
      },
    },
    {
      actions: {
        getUserMedia,
        setupConnectionListener,
        callUser,
        answerCall,
        muteAudio,
        unmuteAudio,
      },
    }
  );

export const useAudioConnection = create(xstate(audioConnectionMachine));

export const sendAudioConnEvent = useAudioConnection.getState().send;
