from event_handlers.base_toggle_event_handler import BaseToggleEventHandler


class PinToggleEventHandler(BaseToggleEventHandler):
    """
    A Stream Deck button that shows your raised pin ,
    and toggles the pin on and off when you press the button.
    """

    STREAM_DECK_ACTION = "com.chrisregado.googlemeet.togglepin"

    BROWSER_STATE_REQUEST_EVENT_TYPE = "getPinState"
    BROWSER_STATE_UPDATED_EVENT_TYPE = "pinMutedState"
    BROWSER_TOGGLE_EVENT_TYPE = "togglePin"
    FRIENDLY_DEVICE_NAME = "Pin"
