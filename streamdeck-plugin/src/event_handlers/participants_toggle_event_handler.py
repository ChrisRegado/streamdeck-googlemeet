from event_handlers.base_event_handler import EventHandler


class ParticipantsToggleEventHandler(EventHandler):
    """
    A Stream Deck button that toggles display of the sidebar participant list.
    """

    STREAM_DECK_ACTION = "com.chrisregado.googlemeet.toggleparticipants"

    async def _key_up_handler(self, event: dict) -> None:
        participants = self._make_simple_sd_event("toggleParticipants")
        await self._browser_manager.send_to_clients(participants)
