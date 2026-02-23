/**
 * Manages different tabs within the sidepanel pop-out of the Meet UI.
 */
class SidepanelEventHandler extends SDEventHandler {

  _isLikelyVisible = (element) => {
    if (!element) {
      return false;
    }
    const style = window.getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden") {
      return false;
    }
    const rect = element.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0;
  }

  _isExcludedControl = (element) => {
    if (!element) {
      return true;
    }
    const text = (
      (element.textContent || "") + " " +
      ((element.getAttribute && element.getAttribute("aria-label")) || "") + " " +
      ((element.getAttribute && element.getAttribute("title")) || "")
    ).toLowerCase();

    const blockedHints = [
      "call feature notifications",
      "feature notifications and actions",
      "press the down arrow to open the hover tray",
      "hover tray",
      "notifications and actions",
    ];

    return blockedHints.some((hint) => text.includes(hint));
  }

  _toggleParticipantsByKnownMeetSelector = () => {
    // Observed in newer Meet UI: inner span for People tab icon.
    const icon = document.querySelector('span[jsname="WyRtCb"]');
    if (!icon) {
      return false;
    }

    const clickable = icon.closest('button,[role="button"],div[tabindex],div[jsaction]');
    if (!clickable || this._isExcludedControl(clickable) || !this._isLikelyVisible(clickable)) {
      return false;
    }

    clickable.click();
    return true;
  }

  _toggleSidepanel = (sidepanelTabId) => {
    // Handle participants more defensively because Meet's panel controls changed.
    if (sidepanelTabId === 1) {
      if (this._toggleParticipantsByKnownMeetSelector()) {
        return;
      }
    }

    const toggleSelector = `[jsname="A5il2e"][data-panel-id="${sidepanelTabId}"]`;
    const sidepanelToggleButton = document.querySelector(toggleSelector);
    if (
      sidepanelToggleButton &&
      !this._isExcludedControl(sidepanelToggleButton) &&
      this._isLikelyVisible(sidepanelToggleButton)
    ) {
      sidepanelToggleButton.click();
    } else {
      this._throwNotFoundError();
    }
  }

  _throwNotFoundError = () => {
    throw new ControlsNotFoundError("No sidepanel control buttons found!");
  }

}
