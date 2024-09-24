class MicEventHandler extends ToggleEventHandler {

  _controlElementSelector = () => {
    return document.querySelector('div[jsname="Dg9Wp"] [jsname="hw0c9"]') || // after September 2024 Meet redesign
      document.querySelector('div[jsname="Dg9Wp"] [jsname="BOHaEe"]');       // before September 2024 Meet redesign
  }

  _sendMuteState = () => {
    this._sendSimpleMuteStateUpdate("micMutedState");
  }

  handleStreamDeckEvent = (message) => {
    if (message.event === "muteMic") {
      this._setMuteState(true);
    } else if (message.event === "unmuteMic") {
      this._setMuteState(false);
    } else if (message.event === "toggleMic") {
      this._toggleMute();
    } else if (message.event === "getMicState") {
      this._sendMuteState();
    }
  }

}