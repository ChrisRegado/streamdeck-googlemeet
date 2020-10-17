from event_handlers.base_event_handler import EventHandler


class LeaveCallEventHandler(EventHandler):
    """
    A Stream Deck button that leaves the meeting.
    """

    STREAM_DECK_ACTION = "com.chrisregado.googlemeet.leavecall"

    async def _key_up_handler(self, event: dict) -> None:
        leave = self._make_simple_sd_event("leaveCall")
        await self._browser_manager.send_to_clients(leave)
