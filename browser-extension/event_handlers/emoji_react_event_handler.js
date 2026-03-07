class EmojiReactEventHandler extends SDEventHandler {
  emojiDivName = "com.chrisregado.googlemeet.emoji";

  EmojiChoicesButton = () => document.querySelector('button[jsname="G0pghc"]');
  EmojiChoicesPanel = () => document.querySelector('div[jsname="b1OzC"]');
  MoreEmojiButton = () => document.querySelector('button[jsname="ST7Muf"]');
  MoreEmojiPanel = () => document.querySelector('div[jsname="j0di1c"]');
  EmojiSearch = () => document.querySelector('input[jsname="YPqjbf"]');

  handleStreamDeckEvent = (message) => {
    if (message.event === "emojiReact") {
      this._emojiReact(message.emojiChar);
    }
  };

  _findEmojiButton = (emojiChar) => {
    return document.querySelector(
      `button[jsname="vnVdbf"][data-emoji^="${emojiChar}"]`,
    );
  };

  _toggleEmojiChoicesPanel = () => {
    const emojiChoicesButton = this.EmojiChoicesButton();
    if (!emojiChoicesButton) {
      throw new ControlsNotFoundError(
        "Tried to open the emoji reaction panel but could not find the button!",
      );
    }
    emojiChoicesButton.click();
  };

  _toggleMoreEmojiPanel = () => {
    const moreEmojiButton = this.MoreEmojiButton();
    if (!moreEmojiButton) {
      throw new ControlsNotFoundError(
        "Tried to open the more emoji panel but could not find the button!",
      );
    }
    moreEmojiButton.click();
  };

  _hideElement = (el) => {
    el.setAttribute("data-sd-hidden", "true");
    el.style.setProperty("visibility", "hidden", "important");
    el.style.setProperty("position", "fixed", "important");
    el.style.setProperty("top", "-9999px", "important");
  };

  _unhideElement = (el) => {
    el.removeAttribute("data-sd-hidden");
    el.removeAttribute("style");
  };

  _startHidingNewPanels = () => {
    const observer = new MutationObserver(() => {
      const panel = this.EmojiChoicesPanel();
      if (panel && !panel.hasAttribute("data-sd-hidden")) {
        panel.setAttribute("data-sd-hidden", "true");
        panel.style.setProperty("display", "none", "important");
      }
      const morePanel = this.MoreEmojiPanel();
      if (morePanel && !morePanel.hasAttribute("data-sd-hidden")) {
        morePanel.setAttribute("data-sd-hidden", "true");
        this._hideElement(morePanel);
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style"],
    });
    return observer;
  };

  _makeMainPanelInteractable = () => {
    const panel = this.EmojiChoicesPanel();
    if (panel) {
      panel.style.setProperty("display", "flex", "important");
      this._hideElement(panel);
    }
  };

  _delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  _searchAndClickEmoji = async (emojiChar) => {
    const searchInput = this.EmojiSearch();
    if (!searchInput) {
      throw new ControlsNotFoundError(
        "Could not find the emoji search input!",
      );
    }
    searchInput.focus();
    searchInput.value = emojiChar;
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    await this._delay(1000);

    const button = this._findEmojiButton(emojiChar);
    if (!button) {
      throw new ControlsNotFoundError(
        `Could not find button for emoji reaction ${emojiChar}!`,
      );
    }
    button.click();
  };

  _emojiReact = async (emojiChar) => {
    const mainPanelWasOpen = !!this.EmojiChoicesPanel();
    const morePanelWasOpen = !!this.MoreEmojiPanel();

    // Case 1: Emoji is already visible in the DOM — click and done
    const existingButton = this._findEmojiButton(emojiChar);
    if (existingButton) {
      existingButton.click();
      return;
    }

    // Case 2: Main panel is open but emoji isn't in it — need More Emoji
    if (mainPanelWasOpen) {
      // Hide the More Emoji panel as it opens
      const observer = new MutationObserver(() => {
        const morePanel = this.MoreEmojiPanel();
        if (morePanel && !morePanel.hasAttribute("data-sd-hidden")) {
          this._hideElement(morePanel);
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class", "style"],
      });

      try {
        this._toggleMoreEmojiPanel();
        await this._delay(800);
        await this._searchAndClickEmoji(emojiChar);

        // Close More Emoji back to main panel (which was already open)
        observer.disconnect();
        this._toggleEmojiChoicesPanel();
        await this._delay(300);

        // Unhide so user can open it normally later
        const morePanel = this.MoreEmojiPanel();
        if (morePanel) this._unhideElement(morePanel);
      } catch (e) {
        observer.disconnect();
        const morePanel = this.MoreEmojiPanel();
        if (morePanel) this._unhideElement(morePanel);
        throw e;
      }
      return;
    }

    // Case 3: Nothing is open — hide everything, open, find emoji, restore
    const observer = this._startHidingNewPanels();

    try {
      this._toggleEmojiChoicesPanel();
      await this._delay(800);
      this._makeMainPanelInteractable();

      // Check if emoji is in the main panel
      let button = this._findEmojiButton(emojiChar);
      if (button) {
        button.click();
        observer.disconnect();
        this._toggleEmojiChoicesPanel();
        await this._delay(300);
        const panel = this.EmojiChoicesPanel();
        if (panel) this._unhideElement(panel);
        return;
      }

      // Not in main panel — open More Emoji and search
      this._toggleMoreEmojiPanel();
      await this._delay(800);
      await this._searchAndClickEmoji(emojiChar);

      // Close everything: More Emoji -> main panel -> closed
      observer.disconnect();
      this._toggleEmojiChoicesPanel();
      await this._delay(300);
      this._toggleEmojiChoicesPanel();
      await this._delay(300);

      // Clean up all hiding so panels work normally for the user
      const panel = this.EmojiChoicesPanel();
      if (panel) this._unhideElement(panel);
      const morePanel = this.MoreEmojiPanel();
      if (morePanel) this._unhideElement(morePanel);
    } catch (e) {
      observer.disconnect();
      const panel = this.EmojiChoicesPanel();
      if (panel) this._unhideElement(panel);
      const morePanel = this.MoreEmojiPanel();
      if (morePanel) this._unhideElement(morePanel);
      throw e;
    }
  };
}
