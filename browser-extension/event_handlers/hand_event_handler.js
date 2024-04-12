class HandEventHandler extends LabelBasedToggleEventHandler {

  static ButtonLabels = [
    ["Raise hand", "Lower hand"],            // English
    ["Melden", "Meldung zurückziehen"],      // German
    ["Levantar la mano", "Bajar la mano"],   // Spanish
    ["Levantar a mão", "Abaixar a mão"],     // Portuguese
    ["Alza la mano", "Abbassa la mano"],     // Italian
  ];

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
