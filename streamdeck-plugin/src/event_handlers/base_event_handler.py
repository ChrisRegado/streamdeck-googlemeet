import json
import logging


class EventHandler:
    """
    EventHandlers orchestrate our plugin logic. They wait for events to come
    in over both our Stream Deck connection and browser extension connections,
    and can respond however they wish.

    This is the base type. Subclasses should each implement activities for one
    particular action.
    """

    """
    The Stream Deck action ID this EventHandler cares about, as defined by our
    plugin's manifest.json UUID fields. Your subclass's individual event handler
    methods (e.g. `_key_up_handler`) will only receive events destined for this
    action, unless you override the default `on_stream_deck_event` implementation.
    """
    STREAM_DECK_ACTION = "(invalid)"

    def __init__(self, stream_deck: "StreamDeckWebsocketClient", browser_manager: "BrowserWebsocketServer") -> None:
        self._logger = logging.getLogger(__name__)

        self._stream_deck: "StreamDeckWebsocketClient" = stream_deck
        self._browser_manager: "BrowserWebsocketServer" = browser_manager

    async def on_browser_event(self, event: dict) -> None:
        """
        Called by the BrowserWebsocketServer whenever a new event comes in from
        our browser extension.
        """
        pass

    async def on_all_browsers_disconnected(self) -> None:
        """
        Called when there are no longer any connections to our browser extension
        after a disconnection.
        """
        pass

    async def on_stream_deck_event(self, event: dict) -> None:
        """
        Called by the StreamDeckWebsocketClient whenever a new event comes in from
        the Stream Deck desktop app.
        """
        event_type = event.get("event")
        target_action = event.get("action")

        if target_action != self.STREAM_DECK_ACTION:
            # This message is probably intended for some other event handler.
            return

        if event_type == "keyUp":
            await self._key_up_handler(event)
        elif event_type == "willAppear":
            await self._will_appear_handler(event)
        elif event_type == "willDisappear":
            await self._will_disappear_handler(event)
        else:
            # There are several different Stream Deck events we don't care about.
            pass

    async def _key_up_handler(self, event: dict) -> None:
        """
        The "keyUp" event happens when a Stream Deck button is released after
        being pressed.

        Note: We do all of our button actions on keyUp, because keyDown seems to
        be a bit buggy. If you send a setState after keyDown but before the user
        releases the button, the button'a image & title sometimes don't update.
        Future events claim the button _is_ in the proper state, but the button's
        screen is left stale until the next (successful) state transition.
        """
        pass

    async def _will_appear_handler(self, event: dict) -> None:
        """
        The "willAppear" event happens when our button is about to appear on
        the Stream Deck. This event can be used to initialize your button.
        """
        pass

    async def _will_disappear_handler(self, event: dict) -> None:
        """
        The "willDisappear" event is called when the Stream Deck hides our button,
        e.g. if the user switches profiles.
        """
        pass

    def _make_simple_sd_event(self, event_type: str) -> str:
        return json.dumps({"event": event_type})
