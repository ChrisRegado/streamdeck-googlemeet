class CaptionsEventHandler extends LabelBasedToggleEventHandler {

  static ButtonLabels = [
    ["Turn on captions", "Turn off captions"],               // English
  ];

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
