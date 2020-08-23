from event_handlers.base_toggle_event_handler import BaseToggleEventHandler


class MicToggleEventHandler(BaseToggleEventHandler):
    """
    A Stream Deck button that shows the current mic on/off state of your meeting,
    and toggles the mic mute/unmute when you press the button.
    """

    STREAM_DECK_ACTION = "com.chrisregado.googlemeet.togglemic"

    BROWSER_STATE_REQUEST_EVENT_TYPE = "getMicState"
    BROWSER_STATE_UPDATED_EVENT_TYPE = "micMutedState"
    BROWSER_TOGGLE_EVENT_TYPE = "toggleMic"
    FRIENDLY_DEVICE_NAME = "Mic"
