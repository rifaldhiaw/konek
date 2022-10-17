import Peer, { MediaConnection } from "peerjs";
import invariant from "tiny-invariant";
import { createMachine, interpret } from "xstate";
import { Message, useGlobalStore } from "../stores/globalStore";
import { msgUtils } from "../utils/messageUtils";

const initPeer = () => {
  const state = useGlobalStore.getState();

  const peer = new Peer(state.localId);
  useGlobalStore.setState({ peer });

  peer.on("connection", (conn) => {
    useGlobalStore.setState({ conn });

    conn.on("data", (data) => {
      msgUtils.receive(data as Message);
    });

    conn.on("open", () => {
      coreConnectionService.send({ type: "DATA_CONNECTED" });
      useGlobalStore.setState({ status: "connected" });
    });
  });
};

const connectData = () => {
  const state = useGlobalStore.getState();

  invariant(state.peer);
  const conn = state.peer.connect(state.remoteId);

  conn.on("data", (data) => {
    msgUtils.receive(data as Message);
  });

  conn.on("open", () => {
    coreConnectionService.send({ type: "DATA_CONNECTED" });
    useGlobalStore.setState({ status: "connected" });
  });
};

const callAudio = () => {
  const state = useGlobalStore.getState();

  navigator.mediaDevices
    .getUserMedia({ video: false, audio: true })
    .then((localStream) => {
      useGlobalStore.setState({ localAudio: localStream });

      invariant(state.peer);
      var call = state.peer.call(state.remoteId, localStream);

      call.on("stream", function (remoteStream) {
        console.log("got sream caller");
        coreConnectionService.send({ type: "AUDIO_CONNECTED" });
        useGlobalStore.setState({ remoteAudio: remoteStream });
      });
    })
    .catch((err) => {
      // always check for errors at the end.
      console.error(`Audio Player Err: ${err.name}: ${err.message}`);
    });
};

const setupAudioConnectionListener = () => {
  const listener = (call: MediaConnection) => {
    navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then(
      (localStream) => {
        useGlobalStore.setState({ localAudio: localStream });

        call.answer(localStream);
        call.on("stream", (remoteStream) => {
          console.log("got sream in listener");
          coreConnectionService.send({ type: "AUDIO_CONNECTED" });
          useGlobalStore.setState({ remoteAudio: remoteStream });
        });
      },
      (err) => {
        console.error("Failed to get local stream", err);
      }
    );
  };

  const state = useGlobalStore.getState();
  invariant(state.peer);
  state.peer.on("call", listener);
};

export type CoreConnectionState =
  | "waitingLocalId"
  | "connectOrWaitingData"
  | "connectingData"
  | "connectingAudio"
  | "waitingAudioConnection"
  | "inCall";

export const coreConnectionMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QGMD2AnMBhVA7XYyALgJZ4B0A7gIYmm5QAyqy1ANgJIQDEAygKoAhALIcAKgH0OAEQDaABgC6iUAAdUsOmVwqQAD0QAmefPIB2ABwBOeQDZjVqwFYnF27YA0IAJ6Jr5d1tXAGYLeTCARisLAF8YrzRMHHxCUgo0FOIAeXQAdVoibiwsgDkSgFEsSWkAQTEahWUkEHVNNJ1mgwQneWDzXojDKIi3MIAWL18EYzHyMcdrQytgs2CnKzM4hIxsPAJibXIM-aIc-LpuWvqJYrLKsQ5SiQAlSvKOADVyuSVdVq08Louj0+mYBkMrCNbONJn5DORHI4nCsImMhitNvEQIldpl2kc9qkSAxpNQiNRLnUajdShUqt9Gn8NACOqAulZbH0LGZ5hZDBYLGMzE5bBMfEZ5LN5tErEsVmsNltsTtkidDsciQwagBXCBkbg1fjSR40u70n5NNTM9pAxCo+QRcgWBXBCLQiLBIXBWHTQxmBEC4x+kJOQxOMZKnGqokUGhaLW6sjRg54A1Gk23OliBm-Zr-G2dO1Rf3yZarCKuGzLb3ihAROxzQOo9aeyxmQxxLG4VAQOC6KOElO4KgFYlMFjsLhMtraW0INE+iIegLhwVjaHtwU8yMqwf4jXZPIFacsufBYJWJ0tsEX2wbBe1pd9IJjNcb-lCiNYgd49V7sekuSJ4FmyiCWJe66lvytjyMYKxOD6hj8o2fKwcKzqhuGO5JP+6T-gmeqoMBs6FnWQymKiYyvqEpZrGsiHIa+qHBhhYZftsOG-rGo4EUmuGsi01okaBCAclyPLRPyW4imKUz1rYAZ8s2yxCtyHbfruXHDsSWDsGwxGAqRbpLuQTiWB6ERmKsMGoouqLkBWr6hkhZkcrB2G4mqhlWjO3n6IgAC0ni1kF5AmOFEWRZicRAA */
  createMachine<{}>(
    {
      context: {},
      id: "coreConnection",
      initial: "waitingLocalId",
      predictableActionArguments: true,
      states: {
        waitingLocalId: {
          on: {
            SUBMIT_ID: {
              target: "connectOrWaitingData",
              actions: "initPeer",
            },
          },
        },
        connectOrWaitingData: {
          on: {
            CONNECT_DATA: {
              target: "connectingData",
              actions: "connectData",
            },
            DATA_CONNECTED: {
              target: "waitingAudioConnection",
              actions: "setupAudioConnectionListener",
            },
          },
        },
        connectingData: {
          on: {
            DATA_CONNECTED: {
              target: "connectingAudio",
              actions: "callAudio",
            },
          },
        },
        connectingAudio: {
          on: {
            AUDIO_CONNECTED: {
              target: "inCall",
            },
          },
        },
        waitingAudioConnection: {
          on: {
            AUDIO_CONNECTED: {
              target: "inCall",
            },
          },
        },
        inCall: {
          type: "final",
        },
      },
    },
    {
      actions: {
        initPeer,
        connectData,
        callAudio,
        setupAudioConnectionListener,
      },
    }
  );

export const coreConnectionService = interpret(
  coreConnectionMachine
).onTransition((state) => {
  console.log({ transition: state.toStrings()[0] });

  useGlobalStore.setState({
    machineState: state.toStrings()[0] as CoreConnectionState,
  });
});
