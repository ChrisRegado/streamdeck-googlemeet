const RECONNECTION_INTERVAL_SECS = 2;
const HEARTBEAT_INTERVAL_SECS = 20;
const HEARTBEAT_EVENT_NAME = "keepAlive";
const EXTENSION_PORT_NAME = "streamdeck-googlemeet";
const MESSAGE_TYPES = Object.freeze({
  BROWSER_EVENT: "browserEvent",
  STREAM_DECK_CONNECTION_OPENED: "streamDeckConnectionOpened",
  STREAM_DECK_EVENT: "streamDeckEvent",
});

/**
 * Manages our runtime connection to the background extension worker, which in
 * turn owns the localhost websocket to the Stream Deck plugin.
 */
class StreamDeckConnectionMananger {

  constructor() {
    this._port = null;
    this._reconnectTimeoutId = null;
    this._heartbeatIntervalId = null;

    // Any SDEventHandlers registered to receive inbound events from the Stream Deck.
    this._eventHandlers = [];
  }

  registerEventHandler = (eventHandler) => {
    this._eventHandlers.push(eventHandler);
  }

  initialize = () => {
    this._connectToBackground();
  }

  sendMessage = (message) => {
    if (this._port) {
      this._port.postMessage({
        type: MESSAGE_TYPES.BROWSER_EVENT,
        payload: message,
      });
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

  _connectToBackground = () => {
    if (this._port) {
      return;
    }

    this._port = chrome.runtime.connect({ name: EXTENSION_PORT_NAME });

    // Send a message every 20s. Any message over a Port resets the service worker's
    // 30-second idle timer, keeping the worker alive as long as Meet is open.
    this._heartbeatIntervalId = setInterval(() => {
      this.sendMessage({ event: HEARTBEAT_EVENT_NAME });
    }, HEARTBEAT_INTERVAL_SECS * 1000);

    this._port.onMessage.addListener((message) => {
      if (message?.type === MESSAGE_TYPES.STREAM_DECK_CONNECTION_OPENED) {
        this._attemptStateTransmission();
      } else if (message?.type === MESSAGE_TYPES.STREAM_DECK_EVENT) {
        this._eventHandlers.forEach((handler) => handler.handleStreamDeckEvent(message.payload));
      }
    });

    this._port.onDisconnect.addListener(() => {
      this._port = null;
      if (this._heartbeatIntervalId) {
        clearInterval(this._heartbeatIntervalId);
        this._heartbeatIntervalId = null;
      }
      if (this._reconnectTimeoutId) {
        clearTimeout(this._reconnectTimeoutId);
        this._reconnectTimeoutId = null;
      }
      this._reconnectTimeoutId = setTimeout(() => {
        this._reconnectTimeoutId = null;
        this._connectToBackground();
      }, RECONNECTION_INTERVAL_SECS * 1000);
    });
  }

}
