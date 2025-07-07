class ZenModeEventHandler extends ToggleEventHandler {
  handleStreamDeckEvent = (message) => {
    console.log("toggleZenMode", message);
    if (message.event === "toggleZenMode") {
      this._toggleZenMode();
    }
  };

  _toggleZenMode = () => {
    const jsCtrlId = "hVZhab";
    for (const controller of document.querySelectorAll(`[jscontroller="${jsCtrlId}"]`))
      if (controller.style.display === "") controller.style.display = "none";
      else controller.style.display = "";
  };
}
