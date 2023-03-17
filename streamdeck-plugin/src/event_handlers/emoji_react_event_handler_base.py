from event_handlers.base_event_handler import EventHandler


class EmojiReactEventHandlerBase(EventHandler):
    """
    A base handler for Emoji react handlers. Derive from this type
    """

    STREAM_DECK_ACTION = "com.chrisregado.googlemeet.togglechat"

    async def _key_up_handler(self, event: dict) -> None:
        chat = self._make_simple_sd_event("toggleChat")
        await self._browser_manager.send_to_clients(chat)
