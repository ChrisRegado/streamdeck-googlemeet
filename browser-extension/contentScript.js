/**
 * This extension monitors your Meet call to send mute state updates to the
 * Stream Deck, and clicks the mute/unmute buttons for you when you press a
 * key on the Stream Deck.
 */

const RECONNECTION_INTERVAL_SECS = 2;

// The localhost port our Stream Deck plugin is listening on.
const STREAM_DECK_PORT = 2394;

const InputDevice = Object.freeze({
  CAMERA: "camera",
  MIC: "microphone",
});

// This is the connection to the websocket server launched by our Stream Deck plugin.
var socket = null;

/**
 * Connect to our Stream Deck websocket, register message handlers, and infinitely
 * attempt to reconnect if we're unsuccessful or the connection drops.
 */
function initializeWebsocket() {
  socket = new WebSocket("ws://127.0.0.1:" + STREAM_DECK_PORT);

  socket.onerror = function (event) {
    console.error(
      "WebSocket error. Closing socket and reconnecting. Error: ",
      event
    );
    socket.close();
  };

  socket.onclose = function (event) {
    // Note: This Event fires on disconnection and failure to connect.
    setTimeout(function () {
      initializeWebsocket();
    }, RECONNECTION_INTERVAL_SECS * 1000);
  };

  socket.onmessage = function (event) {
    const jsonMessage = JSON.parse(event.data);
    if (jsonMessage.event === "muteMic") {
      setMuteState(InputDevice.MIC, true);
    } else if (jsonMessage.event === "unmuteMic") {
      setMuteState(InputDevice.MIC, false);
    } else if (jsonMessage.event === "disableCamera") {
      setMuteState(InputDevice.CAMERA, true);
    } else if (jsonMessage.event === "enableCamera") {
      setMuteState(InputDevice.CAMERA, false);
    } else if (jsonMessage.event === "toggleMic") {
      toggleMute(InputDevice.MIC);
    } else if (jsonMessage.event === "toggleCamera") {
      toggleMute(InputDevice.CAMERA);
    } else if (jsonMessage.event === "getMicState") {
      sendMicState(isElementMuted(getMuteElement("microphone")));
    } else if (jsonMessage.event === "getCameraState") {
      sendCameraState(isElementMuted(getMuteElement("camera")));
    } else {
      console.warn(
        "Received unknown event from Stream Deck plugin: ",
        jsonMessage.event
      );
    }
  };
}

/**
 * Most of Meet's attributes and classes are obfuscated, so we have to try to
 * identify the buttons based on the few human-readable data attributes we have.
 */
function getMuteElement(inputDevice /* An InputDevice */) {
  const muteElements = Array.from(document.querySelectorAll("[data-is-muted]"));
  const found = muteElements.find((element) => {
    return (
      element.dataset.tooltip && element.dataset.tooltip.includes(inputDevice)
    );
  });

  if (!found) {
    /**
     * We expect these elements to always be present in any active meeting, and
     * there's not much our extension can do if the mute buttons are missing.
     */
    throw Error("No mute/unmute button found for " + inputDevice);
  }

  return found;
}

function isElementMuted(element) {
  return element.dataset.isMuted === "true";
}

function toggleMute(inputDevice) {
  const element = getMuteElement(inputDevice);
  element.click();
}

function setMuteState(inputDevice, muted) {
  const button = getMuteElement(inputDevice);
  if (isElementMuted(button) !== muted) {
    button.click();
  }
}

/**
 * Our hook to be notified when the mute/unmute buttons change, including if the
 * user manually clicks Meet's buttons.
 */
function observeMuteStateChanges(onChange) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.body, {
    childList: false,
    attributes: true,
    attributeFilter: ["data-is-muted"],
    attributeOldValue: true,
    subtree: true,
  });
}

function handleMuteStateChange(mutationsList) {
  for (const mutation of mutationsList) {
    if (mutation.type === "attributes") {
      const oldIsMuted = Boolean(
        mutation.oldValue == null || mutation.oldValue === "true"
      );
      const newIsMuted = isElementMuted(mutation.target);

      if (oldIsMuted !== newIsMuted) {
        const tooltip = mutation.target.dataset.tooltip;
        if (tooltip) {
          Object.values(InputDevice).forEach((inputDevice) => {
            if (tooltip.includes(inputDevice)) {
              sendMuteState(inputDevice, newIsMuted);
            }
          });
        }
      }
    }
  }
}

function sendMuteState(inputDevice, isMuted) {
  let eventName;
  if (inputDevice === InputDevice.CAMERA) {
    eventName = "cameraMutedState";
  } else if (inputDevice === InputDevice.MIC) {
    eventName = "micMutedState";
  } else {
    throw Error("Unknown input device: " + inputDevice);
  }

  const message = {
    event: eventName,
    muted: isMuted,
  };
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  }
}

/**
 * Our extension is loaded only after the window is loaded as per the extension's
 * manifest.json, so we are free to initialize as soon as we load.
 */
initializeWebsocket();

// Also fires when the meeting starts, to send our initial state to the plugin.
observeMuteStateChanges(handleMuteStateChange);
