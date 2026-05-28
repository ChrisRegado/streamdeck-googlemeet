import asyncio
import json
import logging
from typing import List, TYPE_CHECKING, Set
import websockets

if TYPE_CHECKING:
    from event_handlers.base_event_handler import EventHandler


class BrowserWebsocketServer:
    DISCONNECT_NOTIFY_DELAY_SECONDS = 8.0

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

    def __init__(self, disconnect_notify_delay_seconds: float | None = None):
        """
        Remember to call start() before attempting to use your new instance!
        """

        self._logger = logging.getLogger(__name__)
        self._disconnect_notify_delay_seconds = (
            disconnect_notify_delay_seconds
            if disconnect_notify_delay_seconds is not None
            else self.DISCONNECT_NOTIFY_DELAY_SECONDS
        )

        """
        Store all of the connected sockets we have open to the browser extension,
        so we can use them to send outbound messages from this plugin to the
        extension.
        """
        self._ws_clients: Set[websockets.ServerConnection] = set()

        """
        Any EventHandlers registered to receive inbound events from the browser extension.
        """
        self._handlers: List["EventHandler"] = []
        self._disconnect_notify_task: asyncio.Task | None = None

    async def start(self, hostname: str, port: int) -> websockets.Server:
        return await websockets.serve(self._message_receive_loop, hostname, port)

    async def send_to_clients(self, message: str) -> None:
        """
        Send a message from our plugin to the Chrome extension. We broadcast to
        any connections we have, in case the user has multiple Meet windows/tabs
        open.
        """
        if self._ws_clients:
            self._logger.info(
                f"Broadcasting message to connected browser clients: {message}")
            await asyncio.gather(*[client.send(message) for client in self._ws_clients])
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

    def _register_client(self, ws: websockets.ServerConnection) -> None:
        self._cancel_disconnect_notification()
        self._ws_clients.add(ws)
        self._logger.info(
            (f"{ws.remote_address} has connected to our browser websocket."
             f" We now have {len(self._ws_clients)} active connection(s)."))

    async def _unregister_client(self, ws: websockets.ServerConnection) -> None:
        try:
            await ws.close()
        except Exception:
            self._logger.exception(
                "Exception while closing browser webocket connection.")
        if ws in self._ws_clients:
            self._ws_clients.remove(ws)
        self._logger.info(
            (f"{ws.remote_address} has disconnected from our browser websocket."
             f" We now have {len(self._ws_clients)} active connection(s) remaining."))

    async def _message_receive_loop(self, ws: websockets.ServerConnection) -> None:
        """
        Loop of waiting for and processing inbound websocket messages, until the
        connection dies. Each connection will create one of these coroutines.
        """
        had_clients = bool(self._ws_clients)
        self._register_client(ws)
        if not had_clients:
            for handler in self._handlers:
                try:
                    await handler.on_browser_connected()
                except Exception:
                    self._logger.exception(
                        "Connection mananger received an exception from EventHandler!")
        try:
            async for message in ws:
                self._logger.info(
                    f"Received inbound message from browser extension. Message: {str(message)}")
                await self._process_inbound_message(message)
        except Exception:
            self._logger.exception(
                "BrowserWebsocketServer encountered an exception while waiting for inbound messages.")
        finally:
            await self._unregister_client(ws)

        if not self._ws_clients:
            self._schedule_disconnect_notification()

    def _schedule_disconnect_notification(self) -> None:
        if self._disconnect_notify_task and not self._disconnect_notify_task.done():
            return

        self._logger.info(
            ("Scheduling browser disconnect notification in"
             f" {self._disconnect_notify_delay_seconds} seconds."))
        self._disconnect_notify_task = asyncio.create_task(
            self._notify_all_browsers_disconnected_after_delay())

    def _cancel_disconnect_notification(self) -> None:
        if not self._disconnect_notify_task:
            return

        if self._disconnect_notify_task.done():
            self._disconnect_notify_task = None
            return

        self._logger.info(
            ("Cancelled pending browser disconnect notification because a"
             " browser client connected."))
        self._disconnect_notify_task.cancel()
        self._disconnect_notify_task = None

    async def _notify_all_browsers_disconnected_after_delay(self) -> None:
        current_task = asyncio.current_task()

        try:
            await asyncio.sleep(self._disconnect_notify_delay_seconds)
            self._logger.info(
                ("Browser disconnect notification fired after"
                 f" {self._disconnect_notify_delay_seconds} seconds."))
            for handler in self._handlers:
                try:
                    await handler.on_all_browsers_disconnected()
                except Exception:
                    self._logger.exception(
                        "Connection mananger received an exception from EventHandler!")
        except asyncio.CancelledError:
            raise
        finally:
            if self._disconnect_notify_task is current_task:
                self._disconnect_notify_task = None

    async def _process_inbound_message(self, message: str | bytes) -> None:
        """
        Process one individual inbound websocket message.
        """
        try:
            parsed_event = json.loads(message)
        except Exception:
            self._logger.exception(
                f"Failed to parse browser websocket message as JSON. Message: {str(message)}")
            return

        for handler in self._handlers:
            try:
                await handler.on_browser_event(parsed_event)
            except Exception:
                self._logger.exception(
                    "Connection mananger received an exception from EventHandler!")
