class HandEventHandler extends ToggleEventHandler {

  /**
   * These are human-readable aria labels found on the Raise Hand button, in
   * different languages. The first element of each pair should be a substring
   * of the label when the hand is lowered, and the second when the hand is raised.
   *
   * Unlike most of our other controls, there don't seem to be unique `jsname`s
   * for the hand button. If we discover another reliable way to identify hand
   * controls that doesn't involve localized words, we should update this class
   * to use that instead.
   */
  static HandButtonLabels = [
    ["Raise hand", "Lower hand"],            // English
    ["Melden", "Meldung zurückziehen"],      // German
  ];

  static FlatHandButtonLabels = HandEventHandler.HandButtonLabels.flat();

  static MutedHandButtonLabels = HandEventHandler.HandButtonLabels.map((languagePair) => {
    return languagePair[0];
  })

  _isHandLabel = (ariaLabel) => {
    return Boolean(
      ariaLabel &&
      HandEventHandler.FlatHandButtonLabels.find((l) => ariaLabel.includes(l))
    );
  }

  _controlElementSelector = () => {
    const elements = Array.from(document.querySelectorAll("[aria-label]"));
    return elements.find((element) => {
      const ariaLabel = element.getAttribute("aria-label");
      return this._isHandLabel(ariaLabel);
    });
  }

  _getControlElement = () => {
    /**
     * As of the time this was written, not every Google account has the Raise
     * Hand feature available, so we need to override ToggleEventHandler's
     * default behavior of throwing an error. This effectively means that hand
     * raising will fail silently. We can't be sure if we failed to find the
     * button because the Meet UI changed, or if the user simply doesn't have
     * the feature unlocked, and we don't want to throw errors on every state
     * synchronization attempt.
     */
    return this._controlElementSelector();
  };

  _isElementMuted = (element) => {
    // "muted" means your hand is down.
    if (!element) {
      return true;
    }
    const ariaLabel = element.getAttribute("aria-label");
    return Boolean(HandEventHandler.MutedHandButtonLabels.find((handLabel) =>
      ariaLabel.includes(handLabel)
    ));
  }

  _sendMuteState = () => {
    this._sendSimpleMuteStateUpdate("handMutedState");
  }

  handleStreamDeckEvent = (message) => {
    if (message.event === "toggleHand") {
      this._toggleMute();
    } else if (message.event === "getHandState") {
      this._sendMuteState();
    }
  }

  _handleControlChange = (mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "attributes" && mutation.attributeName === "aria-label") {
        const labelValue = mutation.target.attributes["aria-label"].value;
        if (labelValue && this._isHandLabel(labelValue)) {
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
