const test = require("node:test");
const assert = require("node:assert/strict");

const {
  MESSAGE_TYPES,
  StreamDeckBackgroundBridge,
} = require("../background.js");

function makePort() {
  const messageListeners = [];
  const disconnectListeners = [];

  return {
    postedMessages: [],
    onMessage: {
      addListener(listener) {
        messageListeners.push(listener);
      },
    },
    onDisconnect: {
      addListener(listener) {
        disconnectListeners.push(listener);
      },
    },
    postMessage(message) {
      this.postedMessages.push(message);
    },
    emitMessage(message) {
      messageListeners.forEach((listener) => listener(message));
    },
    disconnect() {
      disconnectListeners.forEach((listener) => listener());
    },
  };
}

function makeSocket() {
  return {
    readyState: 0,
    sentMessages: [],
    closeCalls: 0,
    send(message) {
      this.sentMessages.push(message);
    },
    close() {
      this.closeCalls += 1;
      this.readyState = 3;
      this.onclose?.();
    },
  };
}

test("broadcasts connection-opened and inbound websocket events to content scripts", () => {
  const socket = makeSocket();
  const bridge = new StreamDeckBackgroundBridge({
    webSocketFactory: () => socket,
    setTimeoutFn: () => 1,
    clearTimeoutFn: () => {},
  });
  const port = makePort();

  bridge.addPort(port);
  socket.readyState = 1;
  socket.onopen();
  socket.onmessage({
    data: JSON.stringify({ event: "toggleMic" }),
  });

  assert.deepEqual(port.postedMessages, [
    { type: MESSAGE_TYPES.STREAM_DECK_CONNECTION_OPENED },
    {
      type: MESSAGE_TYPES.STREAM_DECK_EVENT,
      payload: { event: "toggleMic" },
    },
  ]);
});

test("forwards browser events from content scripts to the websocket", () => {
  const socket = makeSocket();
  const bridge = new StreamDeckBackgroundBridge({
    webSocketFactory: () => socket,
    setTimeoutFn: () => 1,
    clearTimeoutFn: () => {},
  });
  const port = makePort();

  bridge.addPort(port);
  socket.readyState = 1;

  port.emitMessage({
    type: MESSAGE_TYPES.BROWSER_EVENT,
    payload: { event: "micMutedState", muted: true },
  });

  assert.deepEqual(socket.sentMessages, [
    JSON.stringify({ event: "micMutedState", muted: true }),
  ]);
});

test("closes the websocket when the last content script disconnects", () => {
  const socket = makeSocket();
  const bridge = new StreamDeckBackgroundBridge({
    webSocketFactory: () => socket,
    setTimeoutFn: () => 1,
    clearTimeoutFn: () => {},
  });
  const port = makePort();

  bridge.addPort(port);
  socket.readyState = 1;

  port.disconnect();

  assert.equal(socket.closeCalls, 1);
});

test("schedules a reconnect when the websocket errors", () => {
  let timeoutsScheduled = 0;
  const socket = makeSocket();
  const bridge = new StreamDeckBackgroundBridge({
    webSocketFactory: () => socket,
    setTimeoutFn: () => {
      timeoutsScheduled += 1;
      return 1;
    },
    clearTimeoutFn: () => {},
  });
  const port = makePort();

  bridge.addPort(port);
  socket.readyState = 1;

  // Simulate an error
  socket.onerror(new Error("socket error"));

  assert.equal(socket.closeCalls, 1);
  assert.equal(timeoutsScheduled, 1);
});

test("schedules a reconnect when the websocket closes", () => {
  let timeoutsScheduled = 0;
  const socket = makeSocket();
  const bridge = new StreamDeckBackgroundBridge({
    webSocketFactory: () => socket,
    setTimeoutFn: () => {
      timeoutsScheduled += 1;
      return 1;
    },
    clearTimeoutFn: () => {},
  });
  const port = makePort();

  bridge.addPort(port);
  socket.readyState = 1;

  socket.close();

  assert.equal(socket.closeCalls, 1);
  assert.equal(timeoutsScheduled, 1);
});
