class CameraEventHandler extends ToggleEventHandler {

  _controlElementSelector = () => {
    return document.querySelector('div[jsname="R3GXJb"] [jsname="psRWwc"]') || // after September 2024 Meet redesign
      document.querySelector('div[jsname="R3GXJb"] [jsname="BOHaEe"]');        // before September 2024 Meet redesign
  }

  _sendMuteState = () => {
    this._sendSimpleMuteStateUpdate("cameraMutedState");
  }

  handleStreamDeckEvent = (message) => {
    if (message.event === "disableCamera") {
      this._setMuteState(true);
    } else if (message.event === "enableCamera") {
      this._setMuteState(false);
    } else if (message.event === "toggleCamera") {
      this._toggleMute();
    } else if (message.event === "getCameraState") {
      this._sendMuteState();
    }
  }

}