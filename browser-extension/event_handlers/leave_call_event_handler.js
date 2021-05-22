class LeaveCallEventHandler extends SDEventHandler {

  handleStreamDeckEvent = (message) => {
    if (message.event === "leaveCall") {
      this._leaveCall();
    }
  }

  _leaveCall = () => {
    const button = document.querySelector('[jsname="CQylAd"]');
    if (!button) {
      throw new ControlsNotFoundError("No Leave Call button found!")
    }
    button.click();
  }

}