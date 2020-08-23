import json
from unittest import IsolatedAsyncioTestCase
from unittest.mock import AsyncMock, MagicMock

from event_handlers.mic_toggle_event_handler import MicToggleEventHandler


class MicToggleEventHandlerTests(IsolatedAsyncioTestCase):
    """
    A quick test with real strings to ensure our end-to-end events are working
    as expected. The real logic is tested by our BaseToggleEventHandler tests.
    """

    async def test_key_up_toggle(self):
        """
        Tests that Stream Deck button presses send a mic toggle event to the browser.
        """
        handler = MicToggleEventHandler(AsyncMock(), AsyncMock())
        handler._browser_manager.num_connected_clients = MagicMock(
            return_value=1)
        expected_browser_event = {
            "event": "toggleMic"
        }

        await handler.on_stream_deck_event({
            "event": "willAppear",
            "action": "com.chrisregado.googlemeet.togglemic",
            "context": "test_context"
        })

        await handler.on_stream_deck_event({
            "event": "keyUp",
            "action": "com.chrisregado.googlemeet.togglemic",
            "context": "test_context"
        })

        actual_response = json.loads(
            handler._browser_manager.send_to_clients.call_args[0][0])
        self.assertEqual(expected_browser_event, actual_response)
