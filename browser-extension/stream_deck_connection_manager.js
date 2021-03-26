// The localhost port our Stream Deck plugin is listening on.
const STREAM_DECK_PORT = 2394;

const RECONNECTION_INTERVAL_SECS = 2;

/**
 * Manages our websocket that connects this browser extension to the Stream Deck plugin.
 */
class StreamDeckConnectionMananger {

  constructor() {
    this._socket = null;

    // Any SDEventHandlers registered to receive inbound events from the Stream Deck.
    this._eventHandlers = [];
  }

  registerEventHandler = (eventHandler) => {
    this._eventHandlers.push(eventHandler);
  }

  initialize = () => {
    this._createWebsocket();
  }

  sendMessage = (message) => {
    if (this._socket && this._socket.readyState === WebSocket.OPEN) {
      this._socket.send(JSON.stringify(message));
    }
  }

  /**
   * When our extension loads, if the Meet call buttons are already visible,
   * this will send their current states to the Stream Deck plugin. It also works
   * on reconnections. However, if the Meet UI buttons have not finished loading,
   * this will fail and we'll rely on our EventHandlers to monitor for Meet changes
   * and send initial states when the controls (asynchronously) appear.
   */
  _attemptStateTransmission = () => {
    this._eventHandlers.forEach((handler) => {
      try {
        handler.onNewStreamDeckConnection();
      } catch (e) {
        if (e instanceof ControlsNotFoundError) {
          // These are common at startup.
        } else {
          throw e;
        }
      }
    });
  }

  /**
   * Connect to our Stream Deck websocket and infinitely attempt to reconnect
   * if we're unsuccessful or the connection drops.
   */
  _createWebsocket = () => {
    this._socket = new WebSocket("ws://127.0.0.1:" + STREAM_DECK_PORT);

    this._socket.onerror = (event) => {
      console.error(
        "WebSocket error. Closing socket and reconnecting. Error: ",
        event
      );
      this._socket.close();
    };

    this._socket.onclose = () => {
      // Note: This Event fires on disconnection and failure to connect.
      setTimeout(() => {
        this._createWebsocket();
      }, RECONNECTION_INTERVAL_SECS * 1000);
    };

    this._socket.onopen = () => {
      this._attemptStateTransmission();
    };

    this._socket.onmessage = (event) => {
      const jsonMessage = JSON.parse(event.data);
      this._eventHandlers.forEach((handler) => handler.handleStreamDeckEvent(jsonMessage))
    };
  }

}