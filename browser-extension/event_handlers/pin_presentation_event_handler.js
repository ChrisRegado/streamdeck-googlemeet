class PinPresentationEventHandler extends ToggleEventHandler {

  _controlElementSelector = () => {
    /**
     * For the most part, a presentation is very similar to any normal camera view,
     * but they have a couple of distinguishing aspects. When not pinned, they have a
     * special presentation icon in the name tag. When pinned, they don't display a
     * name tag at all, unlike camera feeds.
     */
    const views = document.querySelectorAll('div[jsname="E2KThb"]');
    if (!views) {
      return undefined;
    }
    for (var i = 0; i < views.length; i++) {
      const presentationIcon = views[i].querySelector('.L3eATc');
      const videoNameTag = views[i].querySelector('div[jsname="giiMnc"]');
      if (presentationIcon || !videoNameTag) {
        return views[i].querySelector('div[jsname="fniDcc"]');
      }
    }
    return undefined;
  }

  _isElementMuted = (element) => {
    // "muted" means there's no pinned presentation.
    if (!element || element.attributes["aria-pressed"] === undefined) {
      /**
       * Note: It seems the "aria-pressed" attribute is usually missing until the
       * first time you try to pin the presentation.
       */
      return true;
    }
    return element.attributes["aria-pressed"]?.value === "false";
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
      attributeFilter: ["aria-pressed", "data-requested-participant-id"],
      attributeOldValue: true,
      subtree: true,
    });
  }

}