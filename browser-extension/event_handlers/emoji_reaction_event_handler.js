class EmojiReactionEventHandler extends SDEventHandler {
    _eventPattern = /emojiReact=(?<emojiChar>\p{Extended_Pictographic})/u;

    handleStreamDeckEvent = (message) => {

        let match = this._eventPattern.exec(message.event);
        if(match) {
            this._emojiReact(match.groups.emojiChar);
        }
    }

    _tryClickEmojiReactButton = (emojiChar, attempts) => {
        return new Promise((resolve) => {
            if (attempts <= 0) {
                throw new ControlsNotFoundError(`Could not find button for emoji reaction ${emojiChar}!`);
            }
            let button = document.querySelector(`div[data-emoji="${emojiChar}"]`);
            if (button) {
                button.click();
                resolve(true);

            } else {
                resolve(new Promise((resolve) => setTimeout(() => {
                    resolve(this._tryClickEmojiReactButton(emojiChar, attempts - 1));
                }, 300)));
            }
        });
    }

    _openEmojiChoicesPanel = () => {
        const emojiChoicesButton = document.querySelector('button[jsname="G0pghc"]');
        if (!emojiChoicesButton) {
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