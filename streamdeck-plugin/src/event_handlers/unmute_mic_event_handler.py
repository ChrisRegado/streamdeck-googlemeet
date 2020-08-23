from event_handlers.base_event_handler import EventHandler


class UnmuteMicEventHandler(EventHandler):
    """
    A Stream Deck button that idempotently unmutes your mic in the meeting. It
    only unmutes no matter how many times you press it.
    """

    STREAM_DECK_ACTION = "com.chrisregado.googlemeet.unmutemic"

    async def _key_up_handler(self, event: dict) -> None:
        unmute = self._make_simple_sd_event("unmuteMic")
        await self._browser_manager.send_to_clients(unmute)
