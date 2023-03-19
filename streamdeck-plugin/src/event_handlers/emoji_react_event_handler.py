from event_handlers.base_event_handler import EventHandler


class EmojiReactEventHandler(EventHandler):
    """
    A reusable handler for Emoji reactions.
    """

    ACTION_TO_EMOJI = {
        "com.chrisregado.googlemeet.emojireact.sparklingheart": "💖",
        "com.chrisregado.googlemeet.emojireact.thumbsup": "👍",
        "com.chrisregado.googlemeet.emojireact.partypopper": "🎉",
        "com.chrisregado.googlemeet.emojireact.clappinghands": "👏",
        "com.chrisregado.googlemeet.emojireact.facewithtearsofjoy": "😂",
        "com.chrisregado.googlemeet.emojireact.facewithopenmouth": "😮",
        "com.chrisregado.googlemeet.emojireact.cryingface": "😢",
        "com.chrisregado.googlemeet.emojireact.thinkingface": "🤔",
        "com.chrisregado.googlemeet.emojireact.thumbsdown": "👎"
    }

    # The full action string is this prefix followed by the literal emoji character sequence
    STREAM_DECK_ACTION_PREFIX = "com.chrisregado.googlemeet.emojireact."

    def _get_emoji_char_for_event(self, event: dict):
        action = event['action']
        emoji_char = self.ACTION_TO_EMOJI.get(action)
        if not emoji_char:
            raise NotImplementedError(f"The action '{action}' was requested, but there is no corresponding emoji.")
        return emoji_char

    @staticmethod
    def _make_emoji_react_browser_plugin_message(self, emoji_char):
        return self._make_simple_sd_event(f"emojiReact={emoji_char}")

    async def _key_up_handler(self, event: dict) -> None:
        emoji_char = self._get_emoji_char_for_event(event)
        message = self._make_emoji_react_browser_plugin_message(emoji_char)
        await self._browser_manager.send_to_clients(message)
