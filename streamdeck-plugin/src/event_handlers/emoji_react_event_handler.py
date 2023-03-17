from event_handlers.base_event_handler import EventHandler

EMOJI_REACTION_PARAMS = [
#    EMOJI  ACTION_URI
    ("💖", "com.chrisregado.googlemeet.emojireact.sparklingheart"),
    ("👍", "com.chrisregado.googlemeet.emojireact.thumbsup"),
    ("🎉", "com.chrisregado.googlemeet.emojireact.partypopper"),
    ("👏", "com.chrisregado.googlemeet.emojireact.clappinghands"),
    ("😂", "com.chrisregado.googlemeet.emojireact.facewithtearsofjoy"),
    ("😮", "com.chrisregado.googlemeet.emojireact.facewithtearsofjoy"),
    ("😢", "com.chrisregado.googlemeet.emojireact.facewithopenmouth"),
    ("🤔", "com.chrisregado.googlemeet.emojireact.thinkingface"),
    ("👎", "com.chrisregado.googlemeet.emojireact.thumbsdown"),
]

class EmojiReactionEventHandler(EventHandler):
    """
    A reusable handler for Emoji reactions.
    """

    def __init__(self, stream_deck: "StreamDeckWebsocketClient", browser_manager: "BrowserWebsocketServer", emoji_char: str, action_uri: str):
        self.STREAM_DECK_ACTION = action_uri
        self._emoji_char = emoji_char
        super().__init__(stream_deck, browser_manager)

    async def _key_up_handler(self, event: dict) -> None:
        message = self._make_simple_sd_event(f"emojiReact={self._emoji_char}")
        await self._browser_manager.send_to_clients(message)
