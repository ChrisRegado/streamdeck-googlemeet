import json
import logging
from typing import List
import websockets


class StreamDeckWebsocketClient:
    """
    The StreamDeckWebsocketClient manages our connection to the Stream Deck
    desktop software, brokering messages between the Stream Deck and our
    plugin's EventHandlers.
    """

    def __init__(self):
        """
        Remember to call start() before attempting to use your new instance!
        """

        self._logger = logging.getLogger(__name__)

        """
        Any EventHandlers registered to receive inbound events from the Stream Deck.
        """
        self._handlers: List["EventHandler"] = []

        """
        Our socket to the Stream Deck desktop software.
        """
        self._websocket: "WebSocketClientProtocol" = None

    async def start(self, port: int, register_event: str, plugin_uuid: str) -> None:
        uri = f"ws://127.0.0.1:{port}"
        self._websocket = await websockets.connect(uri)

        # Complete the mandatory Stream Deck Plugin registration procedure:
        await self.send_outbound_message(json.dumps({
            "event": register_event,
            "uuid": plugin_uuid
        }))

        try:
            # This is an infinite loop until the connection dies:
            await self._message_receive_loop(self._websocket)
        finally:
            await self._websocket.close()
        self._logger.warning("Websocket to Stream Deck disconnected!")

    def register_event_handler(self, handler: "EventHandler") -> None:
        """
        Register your EventHandler with this method to have it receive callbacks
        whenever we get an event over the wire from the Stream Deck app.
        """
        self._handlers.append(handler)

    async def send_outbound_message(self, message: str) -> None:
        """
        Send a message from our plugin to the Stream Deck app.
        """
        if not self._websocket:
            raise Exception(
                "Stream Deck websocket is not open! Failed to send message.")

        self._logger.info(
            f"Sending outbound message to Stream Deck. Message: {message}")
        await self._websocket.send(message)

    async def _message_receive_loop(self, websocket: websockets.WebSocketClientProtocol) -> None:
        """
        Loop of waiting for and processing inbound websocket messages, until the
        connection dies.
        """
        async for message in websocket:
            self._logger.info(
                f"Received inbound message from Stream Deck: {message}")
            await self._process_inbound_message(message)

    async def _process_inbound_message(self, message: str) -> None:
        """
        Process one individual inbound websocket message.
        """
        try:
            parsed_event = json.loads(message)
        except:
            """
            If we're receiving invalid data from the Stream Deck app, our socket
            is in a questionable state... Let the error propagate. If the plugin
            dies, Stream Deck will restart it for us.
            """
            self._logger.exception(
                "Failed to parse Stream Deck message as JSON! Message: {message}")
            raise

        for handler in self._handlers:
            try:
                await handler.on_stream_deck_event(parsed_event)
            except:
                self._logger.exception(
                    "StreamDeckWebsocketClient received an exception from EventHandler!")
