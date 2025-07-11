from event_handlers.base_event_handler import EventHandler


class ZenModeEventHandler(EventHandler):
    """
    A Stream Deck button that toggles to zen mode, i.e. hides control toolbars.

    Note that this is not an official Google Meet feature.
    """

    STREAM_DECK_ACTION = "com.chrisregado.googlemeet.togglezenmode"

    async def _key_up_handler(self, event: dict) -> None:
        message = self._make_simple_sd_event("toggleZenMode")
        await self._browser_manager.send_to_clients(message)
