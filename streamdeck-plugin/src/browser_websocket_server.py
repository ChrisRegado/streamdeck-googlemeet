import asyncio
import json
import logging
from typing import List, Set
import websockets


class BrowserWebsocketServer:
    """
    The BrowserWebsocketServer manages our connection to our browser extension,
    brokering messages between Google Meet and our plugin's EventHandler.

    We expect browser tabs (and our websockets) to come and go, and our plugin is
    long-lived, so we have a lot of exception handling to do here to keep the
    plugin running. Most actions are "best effort".

    We also have to handle the possibility of multiple browser websockets at the
    same time, e.g. in case the user refreshes their Meet window and we have stale
    websockets hanging around, or if we have multiple Meet tabs.
    """

    def __init__(self):
        """
        Remember to call start() before attempting to use your new instance!
        """

        self._logger = logging.getLogger(__name__)

        """
        Store all of the connected sockets we have open to the browser extension,
        so we can use them to send outbound messages from this plugin to the
        extension.
        """
        self._ws_clients: Set[websockets.WebSocketServerProtocol] = set()

        """
        Any EventHandlers registered to receive inbound events from the browser extension.
        """
        self._handlers: List["EventHandler"] = []

    def start(self, hostname: str, port: int) -> None:
        return websockets.serve(self._message_receive_loop, hostname, port)

    async def send_to_clients(self, message: str) -> None:
        """
        Send a message from our plugin to the Chrome extension. We broadcast to
        any connections we have, in case the user has multiple Meet windows/tabs
        open.
        """
        if self._ws_clients:
            self._logger.info(
                f"Broadcasting message to connected browser clients: {message}")
            await asyncio.wait([client.send(message) for client in self._ws_clients])
        else:
            self._logger.warn(
                ("There were no active browser extension clients to send our"
                 f" message to! Message: {message}"))

    def register_event_handler(self, handler: "EventHandler") -> None:
        """
        Register your EventHandler to have it receive callbacks whenever we
        get an event over the wire from the browser extension.
        """
        self._handlers.append(handler)

    def num_connected_clients(self) -> int:
        return len(self._ws_clients)

    def _register_client(self, ws: websockets.WebSocketServerProtocol) -> None:
        self._ws_clients.add(ws)
        self._logger.info(
            (f"{ws.remote_address} has connected to our browser websocket."
             f" We now have {len(self._ws_clients)} active connection(s)."))

    async def _unregister_client(self, ws: websockets.WebSocketServerProtocol) -> None:
        try:
            await ws.close()
        except:
            self._logger.exception(
                "Exception while closing browser webocket connection.")
        if ws in self._ws_clients:
            self._ws_clients.remove(ws)
        self._logger.info(
            (f"{ws.remote_address} has disconnected from our browser websocket."
             f" We now have {len(self._ws_clients)} active connection(s) remaining."))

    async def _message_receive_loop(self, ws: websockets.WebSocketServerProtocol, uri: str) -> None:
        """
        Loop of waiting for and processing inbound websocket messages, until the
        connection dies. Each connection will create one of these coroutines.
        """
        self._register_client(ws)
        try:
            async for message in ws:
                self._logger.info(
                    f"Received inbound message from browser extension. Message: {message}")
                await self._process_inbound_message(message)
        except:
            self._logger.exception(
                "BrowserWebsocketServer encountered an exception while waiting for inbound messages.")
        finally:
            await self._unregister_client(ws)

        if not self._ws_clients:
            for handler in self._handlers:
                try:
                    await handler.on_all_browsers_disconnected()
                except:
                    self._logger.exception(
                        "Connection mananger received an exception from EventHandler!")

    async def _process_inbound_message(self, message: str) -> None:
        """
        Process one individual inbound websocket message.
        """
        try:
            parsed_event = json.loads(message)
        except:
            self._logger.exception(
                f"Failed to parse browser websocket message as JSON. Message: {message}")
            return

        for handler in self._handlers:
            try:
                await handler.on_browser_event(parsed_event)
            except:
                self._logger.exception(
                    "Connection mananger received an exception from EventHandler!")
