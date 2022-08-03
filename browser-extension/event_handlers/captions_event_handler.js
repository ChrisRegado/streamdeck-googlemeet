class CaptionsEventHandler extends ToggleEventHandler {

  /**
   * These are human-readable aria labels found on the Captions button, in
   * different languages. The first element of each pair should be a substring
   * of the label when captions are disabled, and the second when captions are enabled.
   *
   * Unlike most of our other controls, there don't seem to be unique `jsname`s
   * for the captions button. If we discover another reliable way to identify caption
   * controls that doesn't involve localized words, we should update this class
   * to use that instead.
   */
  static CaptionsButtonLabels = [
    ["Turn on captions", "Turn off captions"],                             // English
    // ["Turn on captions (in german)", "Turn off captions (in german)"],  // German
  ];

  static FlatCaptionsButtonLabels = CaptionsEventHandler.CaptionsButtonLabels.flat();

  static MutedCaptionsButtonLabels = CaptionsEventHandler.CaptionsButtonLabels.map((languagePair) => {
    return languagePair[0];
  })

  _isHandLabel = (ariaLabel) => {
    return Boolean(
      ariaLabel &&
      CaptionsEventHandler.FlatCaptionsButtonLabels.find((l) => ariaLabel.includes(l))
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
    return this._controlElementSelector();
  };

  _isElementMuted = (element) => {
    // "muted" means captions are off.
    if (!element) {
      return true;
    }
    const ariaLabel = element.getAttribute("aria-label");
    return Boolean(CaptionsEventHandler.MutedCaptionsButtonLabels.find((handLabel) =>
      ariaLabel.includes(handLabel)
    ));
  }

  _sendMuteState = () => {
    this._sendSimpleMuteStateUpdate("captionsMutedState");
  }

  handleStreamDeckEvent = (message) => {
    if (message.event === "toggleCaptions") {
      this._toggleMute();
    } else if (message.event === "getCaptionsState") {
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
