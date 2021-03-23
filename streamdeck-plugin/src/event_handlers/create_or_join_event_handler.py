import asyncio
import json
from event_handlers.base_event_handler import EventHandler


class CreateOrJoinEventHandler(EventHandler):
    """
    A Stream Deck button that opens the Google Meet landing page
    """

    STREAM_DECK_ACTION = "com.chrisregado.googlemeet.createorjoin"

    async def _key_up_handler(self, event: dict) -> None:
        message = json.dumps({
            "event": "openUrl",
            "payload": { "url": "https://meet.google.com/landing"}
        })

        await asyncio.wait([
            self._stream_deck.send_outbound_message(message)
        ])
