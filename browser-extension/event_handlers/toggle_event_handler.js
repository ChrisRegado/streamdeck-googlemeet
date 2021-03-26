
/**
 * A base class for Stream Deck buttons that let you toggle a device on or off,
 * while showing the current state on the button. These controls need bi-directional
 * syncing, since state changes can occur either from a Stream Deck message or from
 * the user clicking a button in the Meet web UI.
 */
class ToggleEventHandler extends SDEventHandler {

  /**
   * This method should return a clickable button used to toggle your device.
   * We also assume that the current mute state can be read from this element,
   * and pass it to `_isElementMuted`.
   *
   * Implement this in your subclass.
   */
  _controlElementSelector = () => {}

  /**
   * This method will be called for each message we receive from the Stream
   * Deck desktop app.
   *
   * Implement this in your subclass to respond to requests and button presses
   * from the Stream Deck, if the message is relevant to you.
   */
  handleStreamDeckEvent = (message) => {}

  /**
   * This method will be called whenever we need to transmit Meet's current mute
   * state to the Stream Deck plugin.
   *
   * Implement this in your subclass. For simple events, you may be able to just
   * call `_sendSimpleMuteStateUpdate` with an appropriate event name.
   */
  _sendMuteState = () => {}

  _sendSimpleMuteStateUpdate = (eventName) => {
    const isMuted = this._isMuted();
    const message = {
      event: eventName,
      muted: Boolean(isMuted)
    };
    this._connectionManager.sendMessage(message);
  }

  initialize = () => {
    this._registerMutationObserver();
  }

  onNewStreamDeckConnection = () => {
    this._sendMuteState();
  }

  /**
   * This method should fetch our clickable Meet control button in a safe manner
   * such that callers don't need to do any further result checking.
   */
  _getControlElement = () => {
    const element = this._controlElementSelector();
    if (!element) {
      /**
       * We expect these elements to always be present in any active meeting, and
       * there's not much our extension can do if the toggle buttons are missing.
       */
      throw new ControlsNotFoundError(
        "Could not find toggle button in the Meet UI!"
      )
    }
    return element;
  }

  /**
   * Given an element selected by `_controlElementSelector`, return the mute
   * state of the element.
   */
  _isElementMuted = (element) => {
    return element.dataset.isMuted === "true"
  }

  /**
   * Returns the current mute state of the device this ToggleEventHandler controls.
   */
  _isMuted = () => {
    return this._isElementMuted(this._getControlElement());
  }

  _setMuteState = (muted) => {
    if (this._isMuted() !== muted) {
      this._toggleMute();
    }
  }

  _toggleMute = () => {
    this._getControlElement()?.click();
    this._sendMuteState();
  }

  /**
   * Called when we detect that our control element in the Meet UI has been updated.
   * Depending on what changes you set up `_registerMutationObserver` to monitor, you
   * may want to do some extra filtering in here to ensure the mutation is relevant.
   */
  _handleControlChange = (mutationsList) => {
    this._sendMuteState();
  }

  /**
   * Our hooks into the Meet web UI to be notified when the mute/unmute buttons
   * change, including if the user manually clicks Meet's buttons.
   */
  _registerMutationObserver = () => {
    const observer = new MutationObserver(this._handleControlChange);
    /**
     * We watch document.body since controls may appear after our extension loads,
     * or re-appear during meeting transitions, etc., meaning we don't always have
     * a more specific element available to monitor.
     */
    observer.observe(document.body, {
      childList: false,
      attributes: true,
      attributeFilter: ["data-is-muted"],
      attributeOldValue: true,
      subtree: true,
    });
  }

}