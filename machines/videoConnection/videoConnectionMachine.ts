import { createMachine } from "xstate";

export const videoConnectionMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QDcCWEwHsDCmB2eYAxgC6r4B06ANmAMQBqAkgCICiA8gPocByA2gAYAuolAAHTLFRl8YkAA9EARgAsgigE5t2gMybdAJgDshgGzKANCACeic6oqqdADgCsZ44LNvVugL7+1mgYOPiEpOR4VBC0dNgAggAySVwASmzYbEwMbCxCokggktKyePJKCGoaOnoGJuZWtvaCjs46yl6CgsYumoHB6Fi4BMRlFEQAhtTUqHhQAKqwYABOdAm8AMoA6mwZ+SLyJTJRFYiqxmYUum4GbrrGug9uJmbWdggOTq4eXj5+AxAIWG4TGUSoeGw02ojFYnB4ADEEQUjlITnIipVnBo3Mo3PjlN5dMpOqp3ogXIYtLULmpjJoSf0gkChmFRpFKJM8LAAO6rOZQeJ8XiZAAqeRRRWOZTOCAuVxudweT2ML0u5M+rW+HS6PT6gWZeEwGHgRWBbIi4xoYFRpVOmPOhg1miphna9R6fjcrUB5pGlvBUxmAqWq1t6PKDoQRhcFF8hk0zkJgmUDxcGq+tUTZkMKc87l9rP9YMocyhM3DMqjZie1O03tVvlU5gzPTj3Q7ZmctzdqkLoWLHOiXN5-PmlftoEqRg0OecLjpPmUZk0blbbgoHc73ZdF37IPZVYkaKPikQAFo3s0EJfN1uXu5cy4F24Df4gA */
  createMachine<{}>({
    context: {},
    predictableActionArguments: true,
    id: "videoConnection",
    initial: "idle",
    states: {
      idle: {
        on: {
          VIDEO_ON: {
            target: "callingUser",
          },
          CALL_RECEIVED: {
            target: "answering",
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
      inCall: {
        on: {
          VIDEO_OFF: {
            target: "idle",
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
    },
  });
