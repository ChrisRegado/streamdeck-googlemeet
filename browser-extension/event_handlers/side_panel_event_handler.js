/**
 * Manages different tabs within the sidepanel pop-out of the Meet UI.
 */
class SidepanelEventHandler extends SDEventHandler {

  _toggleSidepanel = (sidepanelTabId) => {
    const toggleSelector = `[jscontroller="PIVayb"][data-panel-id="${sidepanelTabId}"]`;
    const sidepanelToggleButton = document.querySelector(toggleSelector);
    if (sidepanelToggleButton) {
      sidepanelToggleButton.click();
    } else {
      this._throwNotFoundError();
    }
  }

  _throwNotFoundError = () => {
    throw new ControlsNotFoundError("No sidepanel control buttons found!");
  }

}