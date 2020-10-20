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

  socket.onclose = function () {
    // Note: This Event fires on disconnection and failure to connect.
    setTimeout(function () {
      initializeWebsocket();
    }, RECONNECTION_INTERVAL_SECS * 1000);
  };

  socket.onopen = function () {
    attemptStateTransmission();
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
    } else if (jsonMessage.event === "leaveCall") {
      leaveCall();
    } else if (jsonMessage.event === "toggleParticipants") {
      toggleParticipants();
    } else if (jsonMessage.event === "toggleChat") {
      toggleChat();
    } else if (jsonMessage.event === "getMicState") {
      sendMuteState(
        InputDevice.MIC,
        isElementMuted(getMuteElement("microphone"))
      );
    } else if (jsonMessage.event === "getCameraState") {
      sendMuteState(
        InputDevice.CAMERA,
        isElementMuted(getMuteElement("camera"))
      );
    } else {
      console.warn(
        "Received unknown event from Stream Deck plugin: ",
        jsonMessage.event
      );
    }
  };
}

/**
 * When our extension loads, if the Meet call buttons are already visible,
 * this will send their current states to the Stream Deck plugin. It also works
 * on reconnections. However, if the buttons have not finished loading, this
 * will fail and we'll rely on our `observeMuteStateChanges` function to
 * handle sending initial states when the controls (asynchronously) appear.
 */
function attemptStateTransmission() {
  try {
    sendMuteState(
      InputDevice.MIC,
      isElementMuted(getMuteElement("microphone"))
    );
    sendMuteState(InputDevice.CAMERA, isElementMuted(getMuteElement("camera")));
  } catch (e) {
    if (e instanceof ControlsNotFoundError) {
      // These are expected at startup.
    } else {
      throw e;
    }
  }
}

class ControlsNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
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
    throw new ControlsNotFoundError(
      "No mute/unmute button found for " + inputDevice
    );
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
 * Get a button based on its aria label.
 */
function getAriaElement(label) {
  const elements = Array.from(document.querySelectorAll("[aria-label]"));
  return elements.find((element) => {
    return (
      element.ariaLabel && element.ariaLabel.includes(label)
    );
  });
}

function leaveCall() {
  const button = getAriaElement("Leave call");
  button.click();
}

/**
 * Toggle display of the participants list in the side panel.
 */
function toggleParticipants() {
  const participantsButton = getAriaElement("participant");
  if (participantsButton != undefined) {
    if (participantsButton.ariaSelected !== "true") {
      participantsButton.click();
    } else {
      const closeButton = getAriaElement("Close");
      closeButton.click();
    }
    return  
  }

  const showEveryoneButton = getAriaElement("Show everyone");
  showEveryoneButton.click();
}

/**
 * Toggle display of the chat messages in the side panel.
 */
function toggleChat() {
  const messagesButton = getAriaElement("messages");
  if (messagesButton != undefined) {
    if (messagesButton.ariaSelected !== "true") {
      messagesButton.click();
    } else {
      const closeButton = getAriaElement("Close");
      closeButton.click();
    }
    return
  }

  const chatEveryoneButton = getAriaElement("Chat with everyone");
  chatEveryoneButton.click();
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

observeMuteStateChanges(handleMuteStateChange);
