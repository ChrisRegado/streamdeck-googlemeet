from event_handlers.base_event_handler import EventHandler


class TurnOffCameraEventHandler(EventHandler):
    """
    A Stream Deck button that idempotently disables your camera in the meeting.
    It only turns the camera off, no matter how many times you press it.
    """

    STREAM_DECK_ACTION = "com.chrisregado.googlemeet.disablecamera"

    async def _key_up_handler(self, event: dict) -> None:
        disable = self._make_simple_sd_event("disableCamera")
        await self._browser_manager.send_to_clients(disable)
