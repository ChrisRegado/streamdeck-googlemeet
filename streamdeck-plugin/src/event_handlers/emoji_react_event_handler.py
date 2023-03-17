from event_handlers.base_event_handler import EventHandler

EMOJI_REACTION_PARAMS = [
    ("💖", "com.chrisregado.googlemeet.emojireact.sparklingheart"),
    # "👍",
    # "🎉",
    # "👏",
    # "😂",
    # "😮",
    # "😢",
    # "🤔",
    # "👎",
]

class EmojiReactEventHandler(EventHandler):
    """
    A reusable handler for Emoji reactions.
    """

    def __init__(self, emoji_char, action_uri):
        self.STREAM_DECK_ACTION = action_uri
        self._emoji_char = emoji_char

    async def _key_up_handler(self, event: dict) -> None:
        message = self._make_simple_sd_event(f"emojiReact={self._emoji_char}")
        await self._browser_manager.send_to_clients(message)
