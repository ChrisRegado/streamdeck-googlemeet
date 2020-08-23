from event_handlers.base_toggle_event_handler import BaseToggleEventHandler


class CameraToggleEventHandler(BaseToggleEventHandler):
    """
    A Stream Deck button that shows the current camera on/off state of your meeting,
    and toggles the camera on and off when you press the button.
    """

    STREAM_DECK_ACTION = "com.chrisregado.googlemeet.togglecamera"

    BROWSER_STATE_REQUEST_EVENT_TYPE = "getCameraState"
    BROWSER_STATE_UPDATED_EVENT_TYPE = "cameraMutedState"
    BROWSER_TOGGLE_EVENT_TYPE = "toggleCamera"
    FRIENDLY_DEVICE_NAME = "Camera"
