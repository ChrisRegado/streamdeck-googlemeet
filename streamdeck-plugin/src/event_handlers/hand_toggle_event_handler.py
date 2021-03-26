from event_handlers.base_toggle_event_handler import BaseToggleEventHandler


class HandToggleEventHandler(BaseToggleEventHandler):
    """
    A Stream Deck button that shows whether or not your hand is raised,
    and toggles the hand on and off when you press the button.
    """

    STREAM_DECK_ACTION = "com.chrisregado.googlemeet.togglehand"

    BROWSER_STATE_REQUEST_EVENT_TYPE = "getHandState"
    BROWSER_STATE_UPDATED_EVENT_TYPE = "handMutedState"
    BROWSER_TOGGLE_EVENT_TYPE = "toggleHand"
    FRIENDLY_DEVICE_NAME = "Hand"
