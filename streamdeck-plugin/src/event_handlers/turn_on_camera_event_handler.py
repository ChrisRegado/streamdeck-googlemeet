from event_handlers.base_event_handler import EventHandler


class TurnOnCameraEventHandler(EventHandler):
    """
    A Stream Deck button that idempotently enables your camera in the meeting.
    It only turns the camera on, no matter how many times you press it.
    """

    STREAM_DECK_ACTION = "com.chrisregado.googlemeet.enablecamera"

    async def _key_up_handler(self, event: dict) -> None:
        enable = self._make_simple_sd_event("enableCamera")
        await self._browser_manager.send_to_clients(enable)
