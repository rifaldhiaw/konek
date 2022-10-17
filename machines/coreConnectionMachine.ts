import Peer, { MediaConnection } from "peerjs";
import invariant from "tiny-invariant";
import { createMachine } from "xstate";
import { Message, sendEvent, useGlobalStore } from "../stores/globalStore";
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
      sendEvent({ type: "DATA_CONNECTED" });
    });
  });
};

const connectData = () => {
  const state = useGlobalStore.getState();

  invariant(state.peer);
  const conn = state.peer.connect(state.remoteId);
  useGlobalStore.setState({ conn });

  conn.on("data", (data) => {
    msgUtils.receive(data as Message);
  });

  conn.on("open", () => {
    sendEvent({ type: "DATA_CONNECTED" });
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
        sendEvent({ type: "AUDIO_CONNECTED" });
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
          sendEvent({ type: "AUDIO_CONNECTED" });
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
  /** @xstate-layout N4IgpgJg5mDOIC5QGMD2AnMBhVA7XYyALgJZ4B0A7gIYmm5QAyqy1ANgJIQDEAygKoAhALIcAKgH0OAEQDaABgC6iUAAdUsOmVwqQAD0QAmefPIB2ABwBOeQFYLARkMA2W2du2ANCACeia+TOQa7uAMxmTg5WFgC+Md5omDj4hKQUaCnEAPLoAOq09FDS1ETU3FhZAHKVAKJYktIAgmKNCspIIOqaaTodBggeVuTyDrbODgAsFhbOVs4R3n4IxhPktiYjFqEOjtEOznEJGNh4BMTa5BlnRDn5WgzFpdxNLRIV1XViNXJKul1aeF0-UGw1G4ymMzmC18-kM5CsCIRWwstkME0MoVshxAiROmR6l1OqRIDxKZRejTeVVq9W+bT+GgBvVA-QcIzhoWMhkcHjMzgmrkWRnkq3WJh2212jgO8Rxx2S1wuV2JDEaAFcIGRuI1+NIOFkqR9aT92mpGT0gYhJutyNyHA4zBNJUFQkLloYzPDph6PIYXJNRtjcQriRQaPcoOrNagQ+c8NrdfrDTSviaGd1tJaEE4JrY1qFrFYIs4-eEHG62c5yBDDB57HN7OE4rLcKgIHBdMGiXHcFQCiSmCx2Fx00ys+iKw5QoFbBMrJNHaNwkWg-LuwTldk8v3SaVRxa+ohQqEhiirOFxqETFsPJPp64525DDsUY-V0l10rP7vqPvM4eEC2T0bBLUIJnkCx5DA+Y3T9Cxq2mbYzERc97VCd88UVdJv0jDUyD-QEAKcew1msMwzDsHN+QsWDuQQrYHRQ7Ypww2MCXDQoozINj-zNDNCJZK12XITl5DtXl+UFGFs3kKtogsQxolk2YwhlI4P3xC4SSwdg2AI5l9CtIJTDEzkglREVZysSdVlGR9nGmF0bAmVjPwEzpzV4wyEAAWmcN0-ObGIgA */
  createMachine<{}>(
    {
      context: {},
      predictableActionArguments: true,
      id: "coreConnection",
      initial: "waitingLocalId",
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
