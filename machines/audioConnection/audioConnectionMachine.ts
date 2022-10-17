import { MediaConnection } from "peerjs";
import { assign, createMachine } from "xstate";
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

export type AudioConnectionContext = {
  localStream?: MediaStream;
  remoteStream?: MediaStream;
  connection?: MediaConnection;
};

export type AudioConnectionEvents =
  | { type: "START" }
  | { type: "FAILED_GET_LOCAL_AUDIO" }
  | { type: "LOCAL_AUDIO_READY"; localStream: MediaStream }
  | { type: "CALL_USER" }
  | { type: "CALL_USER_OK"; connection: MediaConnection }
  | { type: "CALL_RECEIVED"; connection: MediaConnection }
  | { type: "ANSWERED"; remoteStream: MediaStream }
  | { type: "CONNECTED"; remoteStream: MediaStream }
  | { type: "MUTE" }
  | { type: "UNMUTE" };

export type AudioConnectionStates =
  | {
      value: "idle" | "gettingUserMedia";
      context: AudioConnectionContext;
    }
  | {
      value: "ready" | "callingUser";
      context: AudioConnectionContext & {
        localStream: MediaStream;
      };
    }
  | {
      value: "waitingForAnswer" | "answering";
      context: AudioConnectionContext & {
        localStream: MediaStream;
        connection: MediaConnection;
      };
    }
  | {
      value: "inCall" | "inCall.audioOn" | "inCall.audioOff";
      context: AudioConnectionContext & {
        localStream: MediaStream;
        remoteStream: MediaStream;
        connection: MediaConnection;
      };
    };

const audioConnectionMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QEMCuECWB7AwlgdvmAMYAu2+AdBhADZgDEAygCoCCASiwNoAMAuolAAHLLAzkCQkAA9EAWgDsvAMyUAjMoBsAJi3r1vACwBWRUYA0IAJ6ItRygE5HJgBy8XJoysU7eWgF8AqzRMXAIiMgpKGFJyfCgAVVgwACcAWUgMZAYAGQB5HDZcgH02RIARAEl8ko4AUTYKgE0+QSQQUXFJfGk5BHkVXh1KE39hrV51FUd1V0crWwQTdUpeXkUxlRXHFXUjXlcTIJD0bDxCEh6YsDiMBOS0zMwcgDE2Ktz6ipKAcXqWCUCkVSuVqvk2tIuhIKH0FOYTJRfCYhuotI53EcVItEJotGtnK4tGYtEd7K5XCcQKFzhErtFUmBkBBrAwQaVEkx6hxIR1oT04QNtk51oc5iojDoDkZFDiEGjVuY5h4MYotOYjFSaeFLlECJRGczWey6vUcPUqgA1b68kRiGFSDr9NH49EqLTo1yKdQ6dzGOVGVxrFQ6RS+MOKVzqMaKLVnHWRa7EZC0Wj3JIpVJs4ocrkcEr5ADSts69oFTsQOkcvEoRgO7jGRkc3qJcoVSKM4pMOi8+xDmuC1PjF0T0QA7sgYQlXlhUmx8LAx2kGGwAHJMADq3JtAihZdhFYQHsclG2pgOMcOuzb+g7cwMaKlobmcbCI-p+uQC6XqXTbPyq6rmaLA7u0drdAeoD9Mep5eF4vCXvM2I2HYDjOG4HjDK4gZjIEg7au+epUPcOAprQlDavk+AMOkiQgSW-KQbIuKqIiFJNpo1a7Ci6g3qs7GBvojbdmGr60rq1wkWRFHxvkABmckMIkq60fRu58vujpQSxoZIoojimGM2Hca4cqDGokyqFWxidmYPZBIO+BYBAcDSARdJEdQdBgHuEFacxAwNrWBl1rsOhSghcoUrW2GGO6IZuNs6hiQmH5ULE8QZk8WTIL5Dq9Ie8grEGJjdusighqKBlRUGgadlWIUuAYeGnG+HnXIaLJ5eW2kDHMGjdj26izCisx1joNUxZ2qhaAlrjbClhFJmR6aPKk3VMc6IaUPYezhToMz7F4lgofKRyUAdUwIWqxI9uqi3teOk6ZTOc7fmkG3+f0Mr4hVaIqBK7oelWbbnZdYq7NWOgGA9EnRF+i5pOmn0Fb1jYXcYob6OYUZmMhSxhmsygGJsjgHYYCGw6O+pSamMlhFRKOCiNp6mPpHg+vYzZyvpox3dM6rqoYvhU2l1D4KRdOUQpTOHs1ah1hVdaTAdJjElFIzDGrAtqt6Gw6KLnm07Qsu9USiis2YXGc02sqnfIPojJZexzI4ky6MYhs9aWfmowF8hYsFdZNiGEUmGZ0OrJZVYyjKbukg5ARAA */
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
              actions: ["setupConnectionListener", "setLocalStream"],
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
              actions: ["setConnection", "answerCall"],
            },
          },
        },
        callingUser: {
          on: {
            CALL_USER_OK: {
              target: "waitingForAnswer",
              actions: "setConnection",
            },
          },
        },
        waitingForAnswer: {
          on: {
            ANSWERED: {
              target: "inCall",
              actions: "setRemoteStream",
            },
          },
        },
        answering: {
          on: {
            CONNECTED: {
              target: "inCall",
              actions: "setRemoteStream",
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
        // setter,
        setLocalStream: assign({
          localStream: (context, event) => {
            if (event.type !== "LOCAL_AUDIO_READY") return;
            return event.localStream;
          },
        }),
        setRemoteStream: assign({
          remoteStream: (context, event) => {
            if (event.type !== "CONNECTED" && event.type !== "ANSWERED") return;
            return event.remoteStream;
          },
        }),
        setConnection: assign({
          connection: (context, event) => {
            if (event.type !== "CALL_USER_OK") return;
            return event.connection;
          },
        }),
      },
    }
  );

export const useAudioConnection = create(xstate(audioConnectionMachine));

export const sendAudioConnEvent = useAudioConnection.getState().send;
