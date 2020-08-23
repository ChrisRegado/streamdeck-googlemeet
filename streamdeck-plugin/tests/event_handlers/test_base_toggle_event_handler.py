import json
from unittest import IsolatedAsyncioTestCase
from unittest.mock import AsyncMock, MagicMock

from src.event_handlers.base_toggle_event_handler import BaseToggleEventHandler

TEST_TOGGLE_CONTEXT = "test_toggle_context"


class MockedToggleEventHandler(BaseToggleEventHandler):
    STREAM_DECK_ACTION = "com.test.action"
    BROWSER_STATE_REQUEST_EVENT_TYPE = "getTestToggleState"
    BROWSER_STATE_UPDATED_EVENT_TYPE = "testMutedState"
    BROWSER_TOGGLE_EVENT_TYPE = "toggleTestDevice"
    FRIENDLY_DEVICE_NAME = "Test Device Name"


def make_mocked_toggle_handler():
    handler = MockedToggleEventHandler(AsyncMock(), AsyncMock())
    handler._toggle_contexts = [TEST_TOGGLE_CONTEXT]
    return handler


class BaseToggleEventHandlerTests(IsolatedAsyncioTestCase):

    def _assert_called_with_json(self, mock, expected: dict) -> None:
        parsed_actual = json.loads(mock.call_args[0][0])
        self.assertEqual(expected, parsed_actual)

    async def test_browser_toggle_request(self):
        """
        Tests that an appropriate button update is sent to the Stream Deck
        when our browser plugin sends its toggle notification event.
        """
        handler = make_mocked_toggle_handler()
        expected_sd_event = {
            "event": "setState",
            "context": TEST_TOGGLE_CONTEXT,
            "payload": {
                "state": 1
            }
        }

        await handler.on_browser_event({
            "event": handler.BROWSER_STATE_UPDATED_EVENT_TYPE,
            "muted": True
        })

        self._assert_called_with_json(
            handler._stream_deck.send_outbound_message, expected_sd_event)

    async def test_browser_disconnection(self):
        """
        Tests that buttons are set to Disconnected when all browsers disconnect.
        """
        handler = make_mocked_toggle_handler()
        expected_sd_event = {
            "event": "setState",
            "context": TEST_TOGGLE_CONTEXT,
            "payload": {
                "state": 0
            }
        }

        await handler.on_all_browsers_disconnected()

        self._assert_called_with_json(
            handler._stream_deck.send_outbound_message, expected_sd_event)

    async def test_key_up_toggle(self):
        """
        Tests that Stream Deck button presses send a toggle request to the
        browser extension.
        """
        handler = make_mocked_toggle_handler()
        handler._browser_manager.num_connected_clients = MagicMock(
            return_value=1)
        expected_browser_event = {
            "event": handler.BROWSER_TOGGLE_EVENT_TYPE
        }

        await handler.on_stream_deck_event({
            "event": "keyUp",
            "action": handler.STREAM_DECK_ACTION,
            "context": TEST_TOGGLE_CONTEXT
        })

        self._assert_called_with_json(
            handler._browser_manager.send_to_clients, expected_browser_event)

    async def test_will_appear_sets_disconnected(self):
        """
        Tests that when a button appears on the Stream Deck, we initialize its
        state to Disconnected.
        """
        handler = make_mocked_toggle_handler()
        expected_sd_event = {
            "event": "setState",
            "context": TEST_TOGGLE_CONTEXT,
            "payload": {
                "state": 0
            }
        }

        await handler.on_stream_deck_event({
            "event": "willAppear",
            "action": handler.STREAM_DECK_ACTION,
            "context": TEST_TOGGLE_CONTEXT
        })

        self._assert_called_with_json(
            handler._stream_deck.send_outbound_message, expected_sd_event)

    async def test_will_appear_sends_state_request(self):
        """
        Tests that when a button appears on the Stream Deck, we trigger a state
        request to the browser to set the initial button state.
        """
        handler = make_mocked_toggle_handler()
        expected_browser_event = {
            "event": handler.BROWSER_STATE_REQUEST_EVENT_TYPE
        }

        await handler.on_stream_deck_event({
            "event": "willAppear",
            "action": handler.STREAM_DECK_ACTION,
            "context": TEST_TOGGLE_CONTEXT
        })

        self._assert_called_with_json(
            handler._browser_manager.send_to_clients, expected_browser_event)

    async def test_contexts_added_and_removed(self):
        """
        Tests that contexts are successfully saved and then removed as buttons
        appear and disappear.
        """
        handler = MockedToggleEventHandler(AsyncMock(), AsyncMock())

        await handler.on_stream_deck_event({
            "event": "willAppear",
            "action": handler.STREAM_DECK_ACTION,
            "context": TEST_TOGGLE_CONTEXT
        })

        self.assertEqual(handler._toggle_contexts, [TEST_TOGGLE_CONTEXT])

        await handler.on_stream_deck_event({
            "event": "willDisappear",
            "action": handler.STREAM_DECK_ACTION,
            "context": TEST_TOGGLE_CONTEXT
        })

        self.assertEqual(handler._toggle_contexts, [])
