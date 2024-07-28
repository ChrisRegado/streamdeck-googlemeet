/**
 * An abstract base class used for toggle controls in the Meet UI that indicate whether or not
 * they're active using an `aria-pressed` attribute on a button tag.
 */
class AriaPressedBasedToggleEventHandler extends ToggleEventHandler {

  // Subclasses should set this to the `jsname` attribute value on the target toggle button in the Meet UI.
  static ButtonJsName;

  _controlElementSelector = () => {
    return document.querySelector(`button[jsname="${this.constructor.ButtonJsName}"]`);
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
        if (jsName === this.constructor.ButtonJsName) {
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
