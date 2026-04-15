// The localhost port our Stream Deck plugin is listening on.
const STREAM_DECK_PORT = 2394;

const RECONNECTION_INTERVAL_SECS = 2;
const HEARTBEAT_INTERVAL_SECS = 20;
const HEARTBEAT_EVENT_NAME = "keepAlive";
const WEBSOCKET_OPEN_STATE = 1;
const PORT_NAME = "streamdeck-googlemeet";

const MESSAGE_TYPES = Object.freeze({
  BROWSER_EVENT: "browserEvent",
  STREAM_DECK_CONNECTION_OPENED: "streamDeckConnectionOpened",
  STREAM_DECK_EVENT: "streamDeckEvent",
});

/**
 * Owns the localhost websocket in extension context and relays messages between
 * the Stream Deck plugin and Meet content scripts.
 */
class StreamDeckBackgroundBridge {

  constructor({
    webSocketFactory = (url) => new WebSocket(url),
    setTimeoutFn = setTimeout,
    clearTimeoutFn = clearTimeout,
    setIntervalFn = setInterval,
    clearIntervalFn = clearInterval,
  } = {}) {
    this._webSocketFactory = webSocketFactory;
    this._setTimeout = setTimeoutFn;
    this._clearTimeout = clearTimeoutFn;
    this._setInterval = setIntervalFn;
    this._clearInterval = clearIntervalFn;

    this._ports = new Set();
    this._socket = null;
    this._heartbeatIntervalId = null;
    this._reconnectTimeoutId = null;
  }

  initialize = () => {
    chrome.runtime.onConnect.addListener((port) => {
      if (port.name !== PORT_NAME) {
        return;
      }
      this.addPort(port);
    });
  }

  addPort = (port) => {
    this._ports.add(port);

    port.onMessage.addListener((message) => {
      this._handlePortMessage(message);
    });

    port.onDisconnect.addListener(() => {
      this._ports.delete(port);
      if (!this._ports.size) {
        this._stopReconnects();
        this._closeSocket();
      }
    });

    if (this._isSocketOpen()) {
      this._notifyConnectionOpened(port);
      return;
    }

    this._createWebsocket();
  }

  _handlePortMessage = (message) => {
    if (message?.type !== MESSAGE_TYPES.BROWSER_EVENT) {
      return;
    }

    this._sendToSocket(message.payload);
  }

  _sendToSocket = (message) => {
    if (!this._isSocketOpen()) {
      return;
    }

    this._socket.send(JSON.stringify(message));
  }

  _isSocketOpen = () => {
    return this._socket && this._socket.readyState === WEBSOCKET_OPEN_STATE;
  }

  _createWebsocket = () => {
    if (!this._ports.size) {
      return;
    }
    if (this._socket && this._socket.readyState !== 3) {
      return;
    }

    this._stopReconnects();
    this._socket = this._webSocketFactory(`ws://127.0.0.1:${STREAM_DECK_PORT}`);

    this._socket.onerror = (event) => {
      console.error(
        "WebSocket error. Closing socket and reconnecting. Error: ",
        event
      );
      this._closeSocket();
    };

    this._socket.onclose = () => {
      this._socket = null;
      this._stopHeartbeat();

      if (!this._ports.size) {
        return;
      }

      this._reconnectTimeoutId = this._setTimeout(() => {
        this._reconnectTimeoutId = null;
        this._createWebsocket();
      }, RECONNECTION_INTERVAL_SECS * 1000);
    };

    this._socket.onopen = () => {
      this._startHeartbeat();
      this._broadcast({
        type: MESSAGE_TYPES.STREAM_DECK_CONNECTION_OPENED,
      });
    };

    this._socket.onmessage = (event) => {
      let jsonMessage;
      try {
        jsonMessage = JSON.parse(event.data);
      } catch (e) {
        console.error("Failed to parse message from Stream Deck plugin.", e);
        return;
      }

      this._broadcast({
        type: MESSAGE_TYPES.STREAM_DECK_EVENT,
        payload: jsonMessage,
      });
    };
  }

  _broadcast = (message) => {
    this._ports.forEach((port) => {
      try {
        port.postMessage(message);
      } catch (e) {
        console.error("Failed to relay message to Meet content script.", e);
      }
    });
  }

  _notifyConnectionOpened = (port) => {
    port.postMessage({
      type: MESSAGE_TYPES.STREAM_DECK_CONNECTION_OPENED,
    });
  }

  _startHeartbeat = () => {
    this._stopHeartbeat();
    this._heartbeatIntervalId = this._setInterval(() => {
      this._sendToSocket({ event: HEARTBEAT_EVENT_NAME });
    }, HEARTBEAT_INTERVAL_SECS * 1000);
  }

  _stopHeartbeat = () => {
    if (this._heartbeatIntervalId) {
      this._clearInterval(this._heartbeatIntervalId);
      this._heartbeatIntervalId = null;
    }
  }

  _stopReconnects = () => {
    if (this._reconnectTimeoutId) {
      this._clearTimeout(this._reconnectTimeoutId);
      this._reconnectTimeoutId = null;
    }
  }

  _closeSocket = () => {
    this._stopHeartbeat();
    if (this._socket) {
      const socket = this._socket;
      this._socket = null;
      socket.onclose = null;
      socket.close();
    }
  }

}

if (typeof module !== "undefined") {
  module.exports = {
    MESSAGE_TYPES,
    StreamDeckBackgroundBridge,
  };
}

if (typeof chrome !== "undefined" && chrome.runtime?.onConnect) {
  const bridge = new StreamDeckBackgroundBridge();
  bridge.initialize();
}
