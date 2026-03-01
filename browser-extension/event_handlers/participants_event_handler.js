class ParticipantsEventHandler extends SDEventHandler {

  handleStreamDeckEvent = (message) => {
    if (message.event === "toggleParticipants") {
      this._toggleParticipants();
    }
  }

  _toggleParticipants = () => {
      const participantsButton = document.querySelector('div[jsname="QbKf1d"]');
      if (participantsButton) {
        participantsButton.click();
      } else {
        throw new ControlsNotFoundError("No Participants button found!");
      }
  };

}
