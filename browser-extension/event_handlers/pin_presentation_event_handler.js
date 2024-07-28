class PinPresentationEventHandler extends ToggleEventHandler {

  _controlElementSelector = () => {
    /**
     * This jsname appears to only be used for presentations. Normal video feeds
     * use `jsname="fxbmRe"`.
     */
    return document.querySelector('button[jsname="fniDcc"]');
  }

  _isElementMuted = (element) => {
    // "muted" means there's no pinned presentation.
    if (!element) {
      return true;
    }

    /**
     * When the presentation is pinned, we see an Unpin icon:
     *   <i class="google-material-icons VfPpkd-kBDsod" aria-hidden="true">keep_off</i>
     * When the presentation is not pinned, we see a Pin icon:
     *   <i class="google-material-icons VfPpkd-kBDsod" aria-hidden="true">keep_outline</i>
     */
    const iTags = element.querySelectorAll('i');
    for (var i = 0; i < iTags.length; i++) {
      if (iTags[i].getHTML().includes('keep_outline')) {
        return true;
      }
    }
    return false;
  }

  _getControlElement = () => {
    /**
     * Unlike most of our controls, the Pin Presentation button is _not_ expected
     * to be available in all meetings. There might be no one presenting. So unlike
     * for normal toggleables, don't throw an error here.
     */
    return this._controlElementSelector();
  };

  _sendMuteState = () => {
    this._sendSimpleMuteStateUpdate("pinPresentationMutedState");
  }

  handleStreamDeckEvent = (message) => {
    if (message.event === "togglePinPresentation") {
      this._toggleMute();
    } else if (message.event === "getPinPresentationState") {
      this._sendMuteState();
    }
  }

  _registerMutationObserver = () => {
    const observer = new MutationObserver(this._handleControlChange);
    observer.observe(document.body, {
      childList: false,
      attributes: true,
      attributeFilter: ["data-requested-participant-id"],
      attributeOldValue: true,
      subtree: true,
    });
  }

}