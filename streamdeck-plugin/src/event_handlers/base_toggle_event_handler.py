import asyncio
from enum import Enum
import json
from typing import List

from event_handlers.base_event_handler import EventHandler


class SDToggleState(Enum):
    """
    Our toggle button state indices, as defined in the plugin's manifest.json.
    """
    DISCONNECTED = 0
    MUTED = 1
    UNMUTED = 2


class BaseToggleEventHandler(EventHandler):
    """
    A base class for Stream Deck buttons that let you toggle a device on or off,
    while showing the current state on the button. Our camera and mic toggle
    buttons have identical logic (just with different event types and independent
    state tracking), so those common elements are implemented once in this class.
    """

    """
    The type of the event we send to the browser extension to request the current
    mute state (as an asynchronous callback).
    """
    BROWSER_STATE_REQUEST_EVENT_TYPE = "(invalid)"

    # The type of the browser extension's state change notification events.
    BROWSER_STATE_UPDATED_EVENT_TYPE = "(invalid)"

    # The type of the event we send to the browser extension to request a mute/unmute toggle.
    BROWSER_TOGGLE_EVENT_TYPE = "(invalid)"

    # Human readable name of the device this handler operates on.
    FRIENDLY_DEVICE_NAME = "(invalid)"

    def __init__(self, stream_deck: "StreamDeckWebsocketClient", browser_manager: "BrowserWebsocketServer") -> None:
        super().__init__(stream_deck, browser_manager)

        """
        These are the opaque "context" values that the Stream Deck SDK uses to
        identify each "action instance", i.e. a particular instantiation of one
        of our Stream Deck buttons. We need to pass these back to the Stream
        Deck later to identify which button we're operating on.
        """
        self._toggle_contexts: List[str] = []

    async def on_browser_event(self, event: dict) -> None:
        event_type = event.get("event")

        if event_type == self.BROWSER_STATE_UPDATED_EVENT_TYPE:
            if event.get("disconnected"):
                desired_sd_state = SDToggleState.DISCONNECTED
            elif event.get("muted"):
                desired_sd_state = SDToggleState.MUTED
            else:
                desired_sd_state = SDToggleState.UNMUTED
            await self._set_stream_deck_mute_state(desired_sd_state)

    async def on_all_browsers_disconnected(self) -> None:
        await self._set_stream_deck_mute_state(state=SDToggleState.DISCONNECTED)

    async def _key_up_handler(self, event: dict) -> None:
        if self._browser_manager.num_connected_clients():
            """
            We have connected browser extensions to send a change request to.
            Note that we don't update the button state here. The plugin will
            send us an update event if it successfully toggles the mute status,
            and our `on_browser_event` will (asynchronously) update the button.
            """
            toggle_event = self._make_simple_sd_event(
                self.BROWSER_TOGGLE_EVENT_TYPE)
            await self._browser_manager.send_to_clients(toggle_event)
        else:
            # No connected browser extensions, so there is no true state to show.
            await self._set_stream_deck_mute_state(state=SDToggleState.DISCONNECTED)

    async def _will_appear_handler(self, event: dict) -> None:
        """
        We save the context of the button that just appeared on the Stream Deck,
        for use in future outbound events.
        """
        context = event.get("context")
        if context:
            self._toggle_contexts.append(context)

        self._logger.info(
            (f"Saved action context {context}. We now have {len(self._toggle_contexts)}"
             f" active {self.FRIENDLY_DEVICE_NAME} contexts."))

        # Until we know otherwise, assume there isn't an active Meet call.
        await self._set_stream_deck_mute_state(SDToggleState.DISCONNECTED)

        # Request current mute state from the browser extension.
        # We'll asynchronously update button states when we get a response.
        await self._browser_manager.send_to_clients(
            self._make_simple_sd_event(self.BROWSER_STATE_REQUEST_EVENT_TYPE))

    async def _will_disappear_handler(self, event: dict) -> None:
        """
        Remove the disappearing button from our saved contexts. The Stream Deck
        will send another willAppear event if/when it comes back.
        """
        context = event.get("context")
        if context in self._toggle_contexts:
            self._toggle_contexts.remove(context)

        self._logger.info(
            (f"Removed action context {context}. We now have {len(self._toggle_contexts)}"
             f" active {self.FRIENDLY_DEVICE_NAME} contexts."))

    async def _set_stream_deck_mute_state(self, state: SDToggleState) -> None:
        """
        Updates what's shown on our Stream Deck's toggle button.
        """
        events = [self._make_sd_set_state_event(
            context, state.value) for context in self._toggle_contexts]

        await asyncio.wait([
            self._stream_deck.send_outbound_message(event) for event in events
        ])

    def _make_sd_set_state_event(self, context: str, state: int) -> str:
        message = json.dumps({
            "event": "setState",
            "context": context,
            "payload": {
                "state": state
            }
        })
        return message
