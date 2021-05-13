class LeaveCallEventHandler extends SDEventHandler {

  handleStreamDeckEvent = (message) => {
    if (message.event === "leaveCall") {
      this._leaveCall();
    }
  }

  _leaveCall = async () => {
    const button = document.querySelector('[jsname="CQylAd"]');
    if (!button) {
      throw new ControlsNotFoundError("No Leave Call button found!")
    }
    button.click();

    await new Promise(r => setTimeout(r, 3000));

    const homeButton = document.querySelector('[jsname="dqt8Pb"]');
    if (homeButton) {
      // non-fatal error if we can't get back to the main Meet page
      homeButton.click();
    }
  }

}
