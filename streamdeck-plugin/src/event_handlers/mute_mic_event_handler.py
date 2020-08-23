from event_handlers.base_event_handler import EventHandler


class MuteMicEventHandler(EventHandler):
    """
    A Stream Deck button that idempotently mutes your mic in the meeting. It
    only mutes no matter how many times you press it.
    """

    STREAM_DECK_ACTION = "com.chrisregado.googlemeet.mutemic"

    async def _key_up_handler(self, event: dict) -> None:
        mute = self._make_simple_sd_event("muteMic")
        await self._browser_manager.send_to_clients(mute)
