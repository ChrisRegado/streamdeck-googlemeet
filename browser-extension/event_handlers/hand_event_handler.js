class HandEventHandler extends AriaPressedBasedToggleEventHandler {

  static ButtonJsNames = ["FpSaz"];

  _sendMuteState = () => {
    this._sendSimpleMuteStateUpdate("handMutedState");
  }

  handleStreamDeckEvent = (message) => {
    if (message.event === "toggleHand") {
      this._toggleMute();
    } else if (message.event === "getHandState") {
      this._sendMuteState();
    }
  }

}
