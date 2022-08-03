/**
 * This extension monitors your Meet call to send mute state updates to the
 * Stream Deck, and clicks the mute/unmute buttons for you when you press a
 * key on the Stream Deck.
 *
 * Our extension is loaded only after the window is loaded as per the extension's
 * manifest.json, so we are free to initialize right away.
 */

const connectionManager = new StreamDeckConnectionMananger();

const eventHandlers = [
  new MicEventHandler(connectionManager),
  new CameraEventHandler(connectionManager),
  new LeaveCallEventHandler(connectionManager),
  new ChatEventHandler(connectionManager),
  new ParticipantsEventHandler(connectionManager),
  new PinPresentationEventHandler(connectionManager),
  new HandEventHandler(connectionManager),
  new CaptionsEventHandler(connectionManager)
]

connectionManager.initialize();
eventHandlers.forEach((handler) => connectionManager.registerEventHandler(handler));
eventHandlers.forEach((handler) => handler.initialize());