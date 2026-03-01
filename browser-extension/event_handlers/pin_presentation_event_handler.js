class PinPresentationEventHandler extends IconBasedEventHandler {

  /**
   * When the presentation is pinned, we see an Unpin icon:
   *   <i class="google-material-icons VfPpkd-kBDsod" aria-hidden="true">keep_off</i>
   * When the presentation is not pinned, we see a Pin icon:
   *   <i class="google-material-icons VfPpkd-kBDsod" aria-hidden="true">keep_outline</i>
   */
  static MutedIconHTML = "keep_outline";

  static MuteStateUpdateEventName = "pinPresentationMutedState";

  static ToggleEventName = "togglePinPresentation";

  static GetMuteStateEventName = "getPinPresentationState";

  _controlElementSelector = () => {
    /**
     * This jsname appears to only be used for presentations. Normal video feeds
     * use `jsname="fxbmRe"`.
     */
    return document.querySelector('button[jsname="fniDcc"]');
  }

}
