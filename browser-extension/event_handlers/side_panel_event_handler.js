/**
 * Manages different tabs within the sidepanel pop-out of the Meet UI.
 */
class SidepanelEventHandler extends SDEventHandler {

   // Note that this button is only available when the sidepanel is open.
   _closeSidepanel = () => {
    document.querySelector('button[jscontroller="soHxf"]')?.click();
  }

  /**
   * We identify different buttons on the sidebar based on their order.
   */
  _toggleSidepanel = (sidepanelTabIndex) => {
    const minNumTabs = sidepanelTabIndex + 1;

    const openSidepanelControls = document.querySelectorAll('div[role="tab"][jsname="AznF2e"]');
    if (openSidepanelControls && openSidepanelControls.length > 0) {
      // The sidepanel is already open.
      if (openSidepanelControls.length < minNumTabs) {
        // Maybe Google changed the sidepanel layout?
        this._throwNotFoundError();
      }
      const targetTabButton = openSidepanelControls[sidepanelTabIndex];
      if (targetTabButton.getAttribute("aria-selected") !== "true") {
        // The sidepanel is open, but we're not on the right tab yet.
        targetTabButton.click();
      } else {
        // We're already on the right tab, so close the sidepanel to toggle it away.
        this._closeSidepanel();
      }
    } else {
      // The sidepanel is currently hidden.
      const closedSidepanelControls = document.querySelectorAll('div[role="button"][jsname="VyLmyb"]');
      if (closedSidepanelControls && closedSidepanelControls.length >= minNumTabs) {
        closedSidepanelControls[sidepanelTabIndex].click();
      } else {
        this._throwNotFoundError();
      }
    }
  }

  _throwNotFoundError = () => {
    throw new ControlsNotFoundError("No sidepanel control buttons found!");
  }

}