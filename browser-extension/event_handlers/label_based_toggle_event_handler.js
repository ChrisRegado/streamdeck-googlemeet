/**
 * Some controls don't have unique `jsname`s, so we instead use human-readable
 * aria labels (in different languages) found in the Meet UI to identify buttons.
 *
 * If we discover another reliable way to identify controls that doesn't involve
 * localized words, we should switch over to that instead.
 */
class LabelBasedToggleEventHandler extends ToggleEventHandler {

  /**
   * Aria label strings representing the toggle button in both on and off states.
   * The first element of each pair should be a substring of the label when the device is
   * "muted"/off, and the second when the device is "unmuted"/on.
   */
  static ButtonLabels = [];

  _getFlatButtonLabels = () => this.constructor.ButtonLabels.flat();

  _getMutedButtonLabels = () => this.constructor.ButtonLabels.map((languagePair) => {
    return languagePair[0];
  })

  _isButtonLabel = (ariaLabel) => {
    return Boolean(
      ariaLabel &&
      this._getFlatButtonLabels().find((l) => ariaLabel.includes(l))
    );
  }

  _controlElementSelector = () => {
    const elements = Array.from(document.querySelectorAll("[aria-label]"));
    return elements.find((element) => {
      const ariaLabel = element.getAttribute("aria-label");
      return this._isButtonLabel(ariaLabel);
    });
  }

  _getControlElement = () => {
    /**
     * Since our controls can only be located for certain languages, we have to
     * treat buttons as optional. We don't want to throw errors on every state
     * synchronization attempt.
     */
    return this._controlElementSelector();
  };

  _isElementMuted = (element) => {
    if (!element) {
      return true;
    }
    const ariaLabel = element.getAttribute("aria-label");
    return Boolean(this._getMutedButtonLabels().find((buttonLabel) =>
      ariaLabel.includes(buttonLabel)
    ));
  }

  _handleControlChange = (mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "attributes" && mutation.attributeName === "aria-label") {
        const labelValue = mutation.target.attributes["aria-label"].value;
        if (labelValue && this._isButtonLabel(labelValue)) {
          this._sendMuteState();
        }
      }
    }
  }

  _registerMutationObserver = () => {
    const observer = new MutationObserver(this._handleControlChange);
    observer.observe(document.body, {
      childList: false,
      attributes: true,
      attributeFilter: ["aria-label"],
      attributeOldValue: true,
      subtree: true,
    });
  }

}
