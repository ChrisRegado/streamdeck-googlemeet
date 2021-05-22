class ParticipantsEventHandler extends SidepanelEventHandler {

  handleStreamDeckEvent = (message) => {
    if (message.event === "toggleParticipants") {
      this._toggleSidepanel(1)
    }
  }

}