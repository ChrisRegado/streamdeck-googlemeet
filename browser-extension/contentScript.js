/**
 * This extension monitors your Meet call to send mute state updates to the
 * Stream Deck, and clicks the mute/unmute buttons for you when you press a
 * key on the Stream Deck.
 */

const RECONNECTION_INTERVAL_SECS = 2;

// The localhost port our Stream Deck plugin is listening on.
const STREAM_DECK_PORT = 2394;

// Strings found in the labels of various Meet UI elements:
const CameraLabels = [
  "camera",                            // English
  "Kamera"                             // German
]
const MicrophoneLabels = [
  "microphone",                        // English
  "Mikrofon"                           // German
]
const LeaveCallButtonLabels = [
  "Leave call",                        // English
  "Anruf verlassen",                   // German
]
const SidepanelCloseButtonLabels = [
  // The close button on the sidepanel when it is open.
  "Close",                             // English
  "Schließen",                         // German
]
const ChatButtonLabels = [
  // This is the chat button that's visible when the sidepanel is closed.
  "Chat with everyone",                // English
  "Mit allen chatten",                 // German
]
const SidepanelChatButtonLabels = [
  // This is the chat button that's visible when the sidepanel is open.
  "messages",                          // English
  "Nachrichten",                       // German
]
const ParticipantsButtonLabels = [
  // This is the participants button that's visible when the sidepanel is closed.
  "Show everyone",                     // English
  "Alle anzeigen",                     // German
]
const SidepanelParticipantsButtonLabels = [
  // This is the participants button that's visible when the sidepanel is open.
  "participant",                       // English
  "Teilnehmer",                        // German
]
const HandButtonLabels = [
  // This is the raise hand button
  ["Raise hand", "Lower hand"],        // English
  ["Melden", "Meldung zurückziehen"],  // TODO: Replace with the equivalent strings in German
];
const PinButtonLabels = [
  // This is the pin presentation button
  ["presentation to your main screen", "presentation to your main screen"],     // English
  ["an meinen Hauptbildschirm anpinnen", "an meinen Hauptbildschirm anpinnen"], // TODO: Replace with the equivalent strings in German
];

const InputDevice = Object.freeze({
  CAMERA: {
    eventName: "cameraMutedState",
    deviceLabels: CameraLabels
  },
  MIC: {
    eventName: "micMutedState",
    deviceLabels: MicrophoneLabels
  },
  HAND: {
    eventName: "handMutedState",
    deviceAriaLabels: HandButtonLabels
  },
  PIN: {
    eventName: "pinMutedState",
    deviceAriaLabels: PinButtonLabels
  }
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
    } else if (jsonMessage.event === "toggleHand") {
      toggleMute(InputDevice.HAND);
    } else if (jsonMessage.event === "togglePin") {
      toggleMute(InputDevice.PIN);
    } else if (jsonMessage.event === "toggleParticipants") {
      toggleParticipants();
    } else if (jsonMessage.event === "toggleChat") {
      toggleChat();
    } else if (jsonMessage.event === "getMicState") {
      sendMuteState(InputDevice.MIC);
    } else if (jsonMessage.event === "getCameraState") {
      sendMuteState(InputDevice.CAMERA);
    } else if (jsonMessage.event === "getHandState") {
      const isMuted = getAriaElement(InputDevice.HAND.deviceAriaLabels[0]);
      sendMuteState(InputDevice.HAND);
    } else if (jsonMessage.event === "getPinState") {
      const isMuted = getAriaElement(nputDevice.PIN.deviceAriaLabels[0]);
      sendMuteState(InputDevice.PIN);
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
    sendMuteState(InputDevice.PIN, true);
    sendMuteState(InputDevice.HAND, true);
    sendMuteState(InputDevice.MIC);
    sendMuteState(InputDevice.CAMERA);
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
  if (inputDevice.deviceAriaLabels) {
    const mutedElement = getAriaElement(inputDevice.deviceAriaLabels[0]);
    const unmutedElement = getAriaElement(inputDevice.deviceAriaLabels[1]);
    return mutedElement || unmutedElement;
  }

  const muteElements = Array.from(document.querySelectorAll("[data-is-muted]"));
  const found = muteElements.find((element) => {
    return (
      element.dataset.tooltip &&
      inputDevice.deviceLabels &&
      inputDevice.deviceLabels.find((dev) =>
        element.dataset.tooltip.includes(dev)
      )
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
  if (!element) {
    return false;
  }

  const ariaLabel = element.attributes["aria-label"];
  const value = ariaLabel && ariaLabel.value;
  if (value) {
    let muteOrUnmute;
    Object.keys(InputDevice).forEach((inputDeviceName) => {
      const inputDevice = InputDevice[inputDeviceName];
      const muteUnmuteStringsAcrossLanguages =
        inputDevice.deviceAriaLabels || [];
      if (muteUnmuteStringsAcrossLanguages) {
        muteUnmuteStringsAcrossLanguages.forEach((muteUnmuteStrings) => {
          const muteString = muteUnmuteStrings[0];
          const unmuteString = muteUnmuteStrings[1];
          if (value.includes(muteString)) {
            muteOrUnmute = true;
          } else if (value.includes(unmuteString)) {
            muteOrUnmute = false;
          }
        });
      }
    });
    if (muteOrUnmute !== undefined) {
      return muteOrUnmute;
    }
  }
  return element.dataset.isMuted === "true";
}

function toggleMute(inputDevice) {
  const element = getMuteElement(inputDevice);
  if (element) {
    element.click();
  } else {
    sendMuteState(inputDevice, undefined, true);
  }
}

function setMuteState(inputDevice, muted) {
  const button = getMuteElement(inputDevice);
  if (button && isElementMuted(button) !== muted) {
    button.click();
  }
}

/**
 * Get a button based on its aria label, returning the first matching element.
 */
function getAriaElement(labels) {
  const elements = Array.from(document.querySelectorAll("[aria-label]"));
  return elements.find((element) => {
    const ariaLabel = element.getAttribute("aria-label");
    return ariaLabel && labels.find((label) => ariaLabel.includes(label));
  });
}

function leaveCall() {
  const button = getAriaElement(LeaveCallButtonLabels);
  button.click();
}

/**
 * Toggle display of the participants list in the side panel.
 */
function toggleParticipants() {
  const participantsButton = getAriaElement(SidepanelParticipantsButtonLabels);
  if (participantsButton != undefined) {
    if (participantsButton.getAttribute("aria-selected") !== "true") {
      participantsButton.click();
    } else {
      const closeButton = getAriaElement(SidepanelCloseButtonLabels);
      closeButton.click();
    }
    return
  }

  const showEveryoneButton = getAriaElement(ParticipantsButtonLabels);
  showEveryoneButton.click();
}

/**
 * Toggle display of the chat messages in the side panel.
 */
function toggleChat() {
  const messagesButton = getAriaElement(SidepanelChatButtonLabels);
  if (messagesButton != undefined) {
    if (messagesButton.getAttribute("aria-selected") !== "true") {
      messagesButton.click();
    } else {
      const closeButton = getAriaElement(SidepanelCloseButtonLabels);
      closeButton.click();
    }
    return
  }

  const chatEveryoneButton = getAriaElement(ChatButtonLabels);
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

  const ariaObserver = new MutationObserver(onChange);
  ariaObserver.observe(document.body, {
    childList: false,
    attributes: true,
    attributeFilter: ["aria-label"],
    attributeOldValue: true,
    subtree: true,
  });
}

function handleMuteStateChange(mutationsList) {
  for (const mutation of mutationsList) {
    if (mutation.type === "attributes") {
      if (mutation.attributeName === "aria-label") {
        const foundKeys = [];
        Object.keys(InputDevice).forEach((inputDeviceName) => {
          const inputDevice = InputDevice[inputDeviceName];
          const muteUnmuteStringsAcrossLanguages =
            inputDevice.deviceAriaLabels || [];
          muteUnmuteStringsAcrossLanguages.forEach((muteUnmuteStrings) => {
            if (muteUnmuteStrings) {
              const muteString = muteUnmuteStrings[0];
              const unmuteString = muteUnmuteStrings[1];
              const value =
                mutation.target.attributes["aria-label"].value || "";
              const ariaPressed = mutation.target.attributes["aria-pressed"];

              let isPressed = ariaPressed && ariaPressed.value;
              isPressed = isPressed || "false";
              isPressed = isPressed === "true";

              if (value.includes(muteString)) {
                sendMuteState(inputDevice, !isPressed);
                foundKeys.push(inputDevice);
              } else if (value.includes(unmuteString)) {
                sendMuteState(inputDevice, isPressed);
                foundKeys.push(inputDevice);
              }
            }
          });
        });
      } else if (mutation.attributeName === "data-is-muted") {
        /**
         * Note: The `null` oldValue case happens at the start of a call. We
         * can't assume an initial mute state, since it's decided by Meet. The
         * normal default is unmuted, but it may start muted if joining a large
         * call, for example.
         */
        const oldIsMuted = Boolean(
          mutation.oldValue == null || mutation.oldValue === "true"
        );
        const newIsMuted = isElementMuted(mutation.target);

        if (oldIsMuted !== newIsMuted) {
          const tooltip = mutation.target.dataset.tooltip;
          if (tooltip) {
            Object.values(InputDevice).forEach((inputDevice) => {
              if (
                inputDevice.deviceLabels &&
                inputDevice.deviceLabels.find((dev) => tooltip.includes(dev)) &&
                !inputDevice.deviceAriaLabels
              ) {
                sendMuteState(inputDevice, newIsMuted);
              }
            });
          }
        }
      }
    }
  }
}

function sendMuteState(inputDevice, isMutedOptional, isDisconnected) {
  let isMuted =
    isMutedOptional === undefined
      ? isElementMuted(getMuteElement(inputDevice))
      : isMutedOptional;
  let eventName = inputDevice.eventName;
  if (eventName === undefined) {
    throw Error("Unknown input device: " + inputDevice);
  }

  const message = {
    event: eventName,
    muted: isMuted,
    disconnected: Boolean(isDisconnected),
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
