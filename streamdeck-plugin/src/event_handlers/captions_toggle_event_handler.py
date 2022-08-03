from event_handlers.base_toggle_event_handler import BaseToggleEventHandler


class CaptionsToggleEventHandler(BaseToggleEventHandler):
    """
    A Stream Deck button that shows whether or not captions are enabled,
    and toggles captions on and off when you press the button.
    """

    STREAM_DECK_ACTION = "com.chrisregado.googlemeet.togglecaptions"

    BROWSER_STATE_REQUEST_EVENT_TYPE = "getCaptionsState"
    BROWSER_STATE_UPDATED_EVENT_TYPE = "captionsMutedState"
    BROWSER_TOGGLE_EVENT_TYPE = "toggleCaptions"
    FRIENDLY_DEVICE_NAME = "Captions"
