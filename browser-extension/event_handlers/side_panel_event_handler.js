/**
 * Manages different tabs within the sidepanel pop-out of the Meet UI.
 */
class SidepanelEventHandler extends SDEventHandler {

  _getLegacyOpenSidepanelControls = () => {
    const nodes = document.querySelectorAll('div[role="tab"][jsname="AznF2e"]');
    return nodes && nodes.length > 0 ? nodes : undefined;
  }

  _getLegacyCloseSidepanelControls = () => {
    const nodes = document.querySelectorAll('div[role="button"][jsname="VyLmyb"]');
    return nodes && nodes.length > 0 ? nodes : undefined;
  }

  /**
   * Handles sidepanel toggling for the older pre-May/June 2021 Meet web UI, before
   * Google revamped it. This can be deleted once the update has rolled out to all
   * users, which at the time of writing is scheduled for mid June.
   */
  _toggleLegacySidepanel = (sidepanelTabIndex) => {
    const minNumTabs = sidepanelTabIndex + 1;

    const openSidepanelControls = this._getLegacyOpenSidepanelControls();
    if (openSidepanelControls) {
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
        document.querySelector('button[jscontroller="soHxf"]')?.click();
      }
    } else {
      // The sidepanel is currently hidden.
      const closedSidepanelControls = this._getLegacyCloseSidepanelControls();
      if (closedSidepanelControls && closedSidepanelControls.length >= minNumTabs) {
        closedSidepanelControls[sidepanelTabIndex].click();
      } else {
        this._throwNotFoundError();
      }
    }
  }

  /**
   * Handles sidepanel toggling for the new May/June 2021 Meet web UI refresh.
   */
  _toggleUpdatedSidepanel = (sidepanelTabId) => {
    const toggleSelector = `[jscontroller="soHxf"][data-panel-id="${sidepanelTabId}"]`;
    const sidepanelToggleButton = document.querySelector(toggleSelector);
    if (sidepanelToggleButton) {
      sidepanelToggleButton.click();
    } else {
      this._throwNotFoundError();
    }
  }

  _toggleSidepanel = (sidepanelTabId) => {
    if (this._getLegacyOpenSidepanelControls() || this._getLegacyCloseSidepanelControls()) {
      this._toggleLegacySidepanel(sidepanelTabId - 1);
    } else {
      this._toggleUpdatedSidepanel(sidepanelTabId);
    }
  }

  _throwNotFoundError = () => {
    throw new ControlsNotFoundError("No sidepanel control buttons found!");
  }

}