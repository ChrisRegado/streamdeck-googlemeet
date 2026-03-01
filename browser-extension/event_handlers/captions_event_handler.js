class CaptionsEventHandler extends IconBasedEventHandler {

  /**
   * When captions are off, we see:
   *   <i class="quRWN-Bz112c google-symbols notranslate" aria-hidden="true" data-google-symbols-override="true">closed_caption_off</i>
   * When captions are on, we see:
   *   <i class="quRWN-Bz112c google-symbols notranslate" aria-hidden="true" data-google-symbols-override="true">closed_caption</i>
   */
  static MutedIconHTML = "closed_caption_off";

  static MuteStateUpdateEventName = "captionsMutedState";

  static ToggleEventName = "toggleCaptions";

  static GetMuteStateEventName = "getCaptionsState";

  _controlElementSelector = () => {
    return document.querySelector('button[jsname="RrG0hf"]') // From approximately Feb 2026 onwards
      || document.querySelector('button[jsname="r8qRAd"]');  // Before Feb 2026 redesign
  }

}
