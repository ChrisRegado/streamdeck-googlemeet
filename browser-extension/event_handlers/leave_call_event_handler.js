class LeaveCallEventHandler extends SDEventHandler {

  handleStreamDeckEvent = (message) => {
    if (message.event === "leaveCall") {
      this._leaveCall();
    }
  }

  /**
   * Some meetings ask you if you want to "just leave the call" or "end the call for everyone"
   * when you try to hang up. If that dialog appears, a 2nd press of our Leave button will
   * select "just leave the call".
   */
  _leaveCall = () => {
    const leaveCallConfirmationButton = document.querySelector('[data-mdc-dialog-action="Pd96ce"]');

    if (leaveCallConfirmationButton) {
      this._clickButton(leaveCallConfirmationButton, 'Leave Call confirmation');
    } else {
      const leaveCallButton = document.querySelector('[jsname="CQylAd"]');
      this._clickButton(leaveCallButton, 'Leave Call');
    }
  }

  _clickButton = (buttonElement, buttonType) => {
    if (!buttonElement) {
      throw new ControlsNotFoundError("No " + buttonType + " button found!");
    }
    buttonElement.click();
  }

}
