from event_handlers.base_event_handler import EventHandler


class EmojiReactEventHandler(EventHandler):
    """
    A reusable handler for Emoji reactions.
    """

    # The full action string is this prefix followed by the literal emoji character sequence
    STREAM_DECK_ACTION_PREFIX = "com.chrisregado.googlemeet.emojireact."

    def __init__(self, stream_deck: "StreamDeckWebsocketClient", browser_manager: "BrowserWebsocketServer"):
        super().__init__(stream_deck, browser_manager)

    @staticmethod
    def _parse_emoji_char_from_event(event: dict):
        return event['action'].split(".")[-1]

    @staticmethod
    def _make_emoji_react_browser_plugin_message(self, emoji_char):
        return self._make_simple_sd_event(f"emojiReact={emoji_char}")

    async def _key_up_handler(self, event: dict) -> None:
        emoji_char = self._parse_emoji_char_from_event(event)
        message = self._make_emoji_react_browser_plugin_message(emoji_char)
        await self._browser_manager.send_to_clients(message)
