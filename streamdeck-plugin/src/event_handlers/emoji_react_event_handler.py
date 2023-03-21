import json
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

    STREAM_DECK_ACTION_PREFIX = "com.chrisregado.googlemeet.emojireact."

    def _get_emoji_char_for_event(self, event: dict) -> str:
        action = event['action']
        emoji_char = self.ACTION_TO_EMOJI.get(action)
        if not emoji_char:
            raise NotImplementedError(f"The action '{action}' was requested, but there is no corresponding emoji.")
        return emoji_char

    @staticmethod
    def _make_emoji_react_browser_plugin_message(emoji_char) -> str:
        return json.dumps({"event": "emojiReact", "emojiChar": emoji_char})

    async def _key_up_handler(self, event: dict) -> None:
        # noinspection PyBroadException
        try:
            emoji_char = self._get_emoji_char_for_event(event)
        except Exception:
            self._logger.exception("Failed to find emoji for event!")
            return
        message = self._make_emoji_react_browser_plugin_message(emoji_char)
        await self._browser_manager.send_to_clients(message)
