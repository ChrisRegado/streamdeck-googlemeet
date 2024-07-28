class CaptionsEventHandler extends AriaPressedBasedToggleEventHandler {

  static ButtonJsName = "r8qRAd";

  _sendMuteState = () => {
    this._sendSimpleMuteStateUpdate("captionsMutedState");
  }

  handleStreamDeckEvent = (message) => {
    if (message.event === "toggleCaptions") {
      this._toggleMute();
    } else if (message.event === "getCaptionsState") {
      this._sendMuteState();
    }
  }

}
