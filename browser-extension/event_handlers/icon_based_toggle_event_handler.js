/**
 * An abstract base class used for toggle controls in the Meet UI that indicate whether or not
 * they're active using an icon that Meet puts in an <i> tag.
 */
class IconBasedEventHandler extends ToggleEventHandler {

  // Subclasses should set this to the content of the <i> tag when the target is "off"/"muted".
  static MutedIconHTML;

  // Subclasses should set this to the name of the event from our Stream Deck plugin
  // that's used to inform the plugin of the current mute state.
  static MuteStateUpdateEventName;

  // Subclasses should set this to the name of the event from our Stream Deck plugin
  // that's used to instruct this browser extension to change the target button's state.
  static ToggleEventName;

  // Subclasses should set this to the name of the event from our Stream Deck plugin
  // that's used by the plugin to request the current mute state.
  static GetMuteStateEventName;

  _isElementMuted = (element) => {
    if (!element) {
      return true;
    }

    const iTags = element.querySelectorAll('i');
    for (var i = 0; i < iTags.length; i++) {
      if (iTags[i].getHTML() == this.constructor.MutedIconHTML) {
        return true;
      }
    }
    return false;
  }

  _getControlElement = () => {
    /**
     * These buttons are not visible under all circumstances (e.g. in the preview before joining
     * a call) so don't throw an error if the button is not found.
     */
    return this._controlElementSelector();
  };

  _sendMuteState = () => {
    this._sendSimpleMuteStateUpdate(this.constructor.MuteStateUpdateEventName);
  }

  handleStreamDeckEvent = (message) => {
    if (message.event === this.constructor.ToggleEventName) {
      this._toggleMute();
    } else if (message.event === this.constructor.GetMuteStateEventName) {
      this._sendMuteState();
    }
  }

  _registerMutationObserver = () => {
    const observer = new MutationObserver(this._handleControlChange);
    observer.observe(document.body, {
      childList: false,
      attributes: true,
      attributeFilter: ["aria-label"],
      attributeOldValue: true,
      subtree: true,
    });
  }

}
