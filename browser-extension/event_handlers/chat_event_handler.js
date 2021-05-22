class ChatEventHandler extends SidepanelEventHandler {

  handleStreamDeckEvent = (message) => {
    if (message.event === "toggleChat") {
      this._toggleSidepanel(2);
    }
  }

}