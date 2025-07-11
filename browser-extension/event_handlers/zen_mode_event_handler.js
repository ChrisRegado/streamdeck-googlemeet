class ZenModeEventHandler extends SDEventHandler {

  handleStreamDeckEvent = (message) => {
    if (message.event === "toggleZenMode") {
      this._toggleZenMode();
    }
  };

  _toggleZenMode = () => {
    // Credit for this code: https://github.com/verlok/google-meet-true-full-screen
    const jsCtrlId = "hVZhab";
    for (const controller of document.querySelectorAll(`[jscontroller="${jsCtrlId}"]`))
      if (controller.style.display === "") {
        controller.style.display = "none";
      } else {
        controller.style.display = "";
      }
  };

}
