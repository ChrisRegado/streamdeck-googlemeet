/**
 * An abstract base class used for toggle controls in the Meet UI that indicate whether or not
 * they're active using an `aria-pressed` attribute on a button tag.
 */
class AriaPressedBasedToggleEventHandler extends ToggleEventHandler {

  // Subclasses should set this to an array of `jsname` attribute value(s) on the target toggle button in the Meet UI.
  // We'll check all of them and take the first result we find.
  static ButtonJsNames;

  _controlElementSelector = () => {
    for (var i = 0; i < this.constructor.ButtonJsNames.length; i++) {
      const button = document.querySelector(`button[jsname="${this.constructor.ButtonJsNames[i]}"]`);
      if (button) {
        return button;
      }
    }
    return null;
  }

  _isElementMuted = (element) => {
    // "muted" means the button is not pressed.
    if (!element) {
      return true;
    }
    if (element.attributes["aria-pressed"]?.value === "true") {
      return false;
    }
    return true;
  }

  _handleControlChange = (mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "attributes" && mutation.attributeName === "aria-pressed") {
        const jsName = mutation.target.attributes["jsname"]?.value;
        if (this.constructor.ButtonJsNames.includes(jsName)) {
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
      attributeFilter: ["aria-pressed"],
      attributeOldValue: true,
      subtree: true,
    });
  }

}
