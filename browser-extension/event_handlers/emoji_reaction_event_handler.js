class EmojiReactionEventHandler extends SDEventHandler {
    _emojiChoices = [
        "💖",
        "👍",
        "🎉",
        "👏",
        "😂",
        "😮",
        "😢",
        "🤔",
        "👎"
    ];

    handleStreamDeckEvent = (message) => {
        if (message.event === "leaveCall") {
            this._emojiReact("💖");
        }
    }

    _tryClickEmojiReactButton = (emojiChar, attempts) => {
        return new Promise((resolve) => {
            if(attempts <= 0)
            {
                throw new ControlsNotFoundError(`Could not find button for emoji reaction ${emojiChar}!`);
            }
            let button = document.querySelector(`div[data-emoji="${emojiChar}"]`);
            if (button) {
                button.click();
                resolve(true);

            } else {
                this._waitForElementDelay(300).then(() => {
                    resolve(this._tryClickEmojiReactButton(emojiChar, attempts - 1));
                })
            }
        });
    }

    _waitForElementDelay = (t) => {
        return new Promise((resolve) => setTimeout(resolve, t))
    }

    _openEmojiChoicesPanel = () => {
        const emojiChoicesButton = document.querySelector('button[jsname="G0pghc"]');
        if(!emojiChoicesButton)
        {
            throw new ControlsNotFoundError("Tried to open the emoji reaction panel but could not find the button!")
        }
        emojiChoicesButton.click();
    }

    _emojiReact = (emojiChar) => {
        this._tryClickEmojiReactButton(emojiChar, 1).catch(() => {
            this._openEmojiChoicesPanel();
            this._tryClickEmojiReactButton(emojiChar, 5);
        });
    }



}