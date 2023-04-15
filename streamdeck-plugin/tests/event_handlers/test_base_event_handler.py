from unittest import IsolatedAsyncioTestCase
from unittest.mock import AsyncMock, MagicMock

from src.event_handlers.base_event_handler import EventHandler


class TestEventHandler(EventHandler):
    STREAM_DECK_ACTION = "com.test.action"


class TestPrefixedEventHandler(EventHandler):
    STREAM_DECK_ACTION_PREFIX = "com.test.prefixedaction"


def make_mocked_event_handler():
    return TestEventHandler(MagicMock(), MagicMock())


def make_mocked_prefixed_event_handler():
    return TestPrefixedEventHandler(MagicMock(), MagicMock())


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

    async def test_action_prefix_match(self):
        """
        Tests that handlers match inbound events based on action prefixes.
        """
        handler = make_mocked_prefixed_event_handler()
        test_event = {"event": "keyUp",
                      "action": f"{handler.STREAM_DECK_ACTION_PREFIX}.testaction"}
        handler._key_up_handler = AsyncMock()

        await handler.on_stream_deck_event(test_event)

        handler._key_up_handler.assert_called_once_with(test_event)

    async def test_double_action_match(self):
        """
        Tests that handlers match inbound events when both the exact and prefix
        comparisons pass, and that only one trigger happens.
        """

        class DoubleMatchEventHandler(EventHandler):
            STREAM_DECK_ACTION = "com.test.action"
            STREAM_DECK_ACTION_PREFIX = STREAM_DECK_ACTION

        handler = DoubleMatchEventHandler(MagicMock(), MagicMock())
        test_event = {"event": "keyUp",
                      "action": handler.STREAM_DECK_ACTION}
        handler._key_up_handler = AsyncMock()

        await handler.on_stream_deck_event(test_event)

        handler._key_up_handler.assert_called_once_with(test_event)

    async def test_only_called_for_specified_action(self):
        """
        Tests that handler methods are NOT called for actions that don't match
        this handler's action filter.
        """
        handler = make_mocked_event_handler()
        test_event = {"event": "keyUp", "action": "notmyaction"}
        handler._key_up_handler = AsyncMock()

        await handler.on_stream_deck_event(test_event)

        handler._key_up_handler.assert_not_called()

    async def test_only_called_for_specified_prefixed_action(self):
        """
        Tests that handler methods are NOT called for other actions that don't
        match our desired action prefix.
        """
        handler = make_mocked_prefixed_event_handler()
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
