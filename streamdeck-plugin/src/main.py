import argparse
import asyncio
import logging

from browser_websocket_server import BrowserWebsocketServer
from event_handlers.camera_toggle_event_handler import CameraToggleEventHandler
from event_handlers.captions_toggle_event_handler import CaptionsToggleEventHandler
from event_handlers.chat_toggle_event_handler import ChatToggleEventHandler
from event_handlers.hand_toggle_event_handler import HandToggleEventHandler
from event_handlers.leave_call_event_handler import LeaveCallEventHandler
from event_handlers.mic_toggle_event_handler import MicToggleEventHandler
from event_handlers.mute_mic_event_handler import MuteMicEventHandler
from event_handlers.open_meet_event_handler import OpenMeetEventHandler
from event_handlers.participants_toggle_event_handler import ParticipantsToggleEventHandler
from event_handlers.pin_presentation_toggle_event_handler import PinPresentationToggleEventHandler
from event_handlers.turn_off_camera_event_handler import TurnOffCameraEventHandler
from event_handlers.turn_on_camera_event_handler import TurnOnCameraEventHandler
from event_handlers.unmute_mic_event_handler import UnmuteMicEventHandler
from stream_deck_client import StreamDeckWebsocketClient


"""
The port that our Websocket server will listen on for connections from our
browser extension.
"""
BROWSER_WEBSOCKET_PORT = 2394


def parse_cli_args():
    """
    These flags are the ones required by the Stream Deck SDK's registration procedure.
    They'll be set by the Stream Deck desktop software when it launches our plugin.
    """
    parser = argparse.ArgumentParser(
        description='Stream Deck Google Meet Plugin')

    parser.add_argument('-port', type=int, required=True)
    parser.add_argument('-pluginUUID', dest='plugin_uuid',
                        type=str, required=True)
    parser.add_argument('-registerEvent', dest='register_event',
                        type=str, required=True)
    parser.add_argument('-info', type=str, required=True)

    # Ignore unknown args in case a Stream Deck update adds optional flags later.
    (known_args, _) = parser.parse_known_args()
    return known_args


def register_handlers(
        stream_deck_client: StreamDeckWebsocketClient,
        browser_manager: BrowserWebsocketServer) -> None:
    event_handlers = [
        CameraToggleEventHandler(stream_deck_client, browser_manager),
        CaptionsToggleEventHandler(stream_deck_client, browser_manager),
        ChatToggleEventHandler(stream_deck_client, browser_manager),
        HandToggleEventHandler(stream_deck_client, browser_manager),
        LeaveCallEventHandler(stream_deck_client, browser_manager),
        MicToggleEventHandler(stream_deck_client, browser_manager),
        MuteMicEventHandler(stream_deck_client, browser_manager),
        OpenMeetEventHandler(stream_deck_client, browser_manager),
        ParticipantsToggleEventHandler(stream_deck_client, browser_manager),
        PinPresentationToggleEventHandler(stream_deck_client, browser_manager),
        TurnOffCameraEventHandler(stream_deck_client, browser_manager),
        TurnOnCameraEventHandler(stream_deck_client, browser_manager),
        UnmuteMicEventHandler(stream_deck_client, browser_manager),
    ]

    for event_handler in event_handlers:
        browser_manager.register_event_handler(event_handler)
        stream_deck_client.register_event_handler(event_handler)


if __name__ == '__main__':
    """
    Note: The Stream Deck SDK doesn't offer any facilities for low-level logging
    from plugins, or even passing any custom CLI flags. While debugging, you may
    want to write logs to a file:
        logging.basicConfig(filename='meetplugin.log', level=logging.INFO)
    This log file will be created in the folder of your installed plugin. On a Mac, that's:
    ~/Library/Application Support/com.elgato.StreamDeck/Plugins/com.chrisregado.googlemeet.sdPlugin/meetplugin.log
    """

    args = parse_cli_args()
    logging.debug(f"Starting with command line args: {args}")

    browser_manager = BrowserWebsocketServer()
    stream_deck_client = StreamDeckWebsocketClient()

    register_handlers(stream_deck_client, browser_manager)

    loop = asyncio.get_event_loop()
    loop.run_until_complete(browser_manager.start(
        hostname="127.0.0.1", port=BROWSER_WEBSOCKET_PORT))
    loop.run_until_complete(stream_deck_client.start(
        port=args.port, register_event=args.register_event, plugin_uuid=args.plugin_uuid))
