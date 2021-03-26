from event_handlers.base_toggle_event_handler import BaseToggleEventHandler


class PinPresentationToggleEventHandler(BaseToggleEventHandler):
    """
    A Stream Deck button that allows you to pin an active presentation to your
    screen when you press the button, and shows you the current pin state.
    """

    STREAM_DECK_ACTION = "com.chrisregado.googlemeet.togglepinpresentation"

    BROWSER_STATE_REQUEST_EVENT_TYPE = "getPinPresentationState"
    BROWSER_STATE_UPDATED_EVENT_TYPE = "pinPresentationMutedState"
    BROWSER_TOGGLE_EVENT_TYPE = "togglePinPresentation"
    FRIENDLY_DEVICE_NAME = "Pin Presentation"
