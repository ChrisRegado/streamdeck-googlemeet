from unittest import IsolatedAsyncioTestCase
from unittest.mock import AsyncMock, MagicMock

from src.event_handlers.base_event_handler import EventHandler


class TestEventHandler(EventHandler):
    STREAM_DECK_ACTION = "com.test.action"


def make_mocked_event_handler():
    return TestEventHandler(MagicMock(), MagicMock())


class BaseEventHandlerTests(IsolatedAsyncioTestCase):

    async def test_key_up_called(self):
        """
        Tests that the key up handler is called for desired Stream Deck events.
        """
        handler = make_mocked_event_handler()
        test_event = {"event": "keyUp", "action": handler.STREAM_DECK_ACTION}
        handler._key_up_handler = AsyncMock()

        await handler.on_stream_deck_event(test_event)

        handler._key_up_handler.assert_called_once_with(test_event)

    async def test_only_called_for_specified_action(self):
        """
        Tests that handler methods are NOT called for other actions.
        """
        handler = make_mocked_event_handler()
        test_event = {"event": "keyUp", "action": "notmyaction"}
        handler._key_up_handler = AsyncMock()

        await handler.on_stream_deck_event(test_event)

        handler._key_up_handler.assert_not_called()

    async def test_will_appear_called(self):
        """
        Tests that the willAppear handler is called for desired Stream Deck events.
        """
        handler = make_mocked_event_handler()
        test_event = {"event": "willAppear",
                      "action": handler.STREAM_DECK_ACTION}
        handler._will_appear_handler = AsyncMock()

        await handler.on_stream_deck_event(test_event)

        handler._will_appear_handler.assert_called_once_with(test_event)

    async def test_will_disappear_called(self):
        """
        Tests that the willDisappear handler is called for desired Stream Deck events.
        """
        handler = make_mocked_event_handler()
        test_event = {"event": "willDisappear",
                      "action": handler.STREAM_DECK_ACTION}
        handler._will_disappear_handler = AsyncMock()

        await handler.on_stream_deck_event(test_event)

        handler._will_disappear_handler.assert_called_once_with(test_event)
