class LeaveCallEventHandler extends SDEventHandler {

  handleStreamDeckEvent = (message) => {
    if (message.event === "leaveCall") {
      this._leaveCall();
    }
  }

  _leaveCall = () => {
    const leaveDialogPresent = document.querySelector('[jscontroller="ZakeSe"]');
    if(leaveDialogPresent) {
      this._leaveCallAction('[data-mdc-dialog-action="Pd96ce"]', 'Leave Call dialog');
    } else {
      this._leaveCallAction('[jsname="CQylAd"]', 'Leave Call button');
    }
  }

  _leaveCallAction = (selector, buttonType) => {
    const button = document.querySelector(selector);
    if (!button) {
      throw new ControlsNotFoundError("No " + buttonType + " found!")
    }
    button.click();
  }

}
