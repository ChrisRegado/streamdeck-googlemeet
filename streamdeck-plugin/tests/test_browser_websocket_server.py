import asyncio
from unittest import IsolatedAsyncioTestCase
from unittest.mock import AsyncMock, MagicMock, call

from src.browser_websocket_server import BrowserWebsocketServer


class BlockingWebsocket:

    def __init__(self):
        self.close = AsyncMock()
        self.remote_address = ("127.0.0.1", 9999)
        self._disconnect_event = asyncio.Event()

    def disconnect(self):
        self._disconnect_event.set()

    def __aiter__(self):
        return self._message_iterator()

    async def _message_iterator(self):
        await self._disconnect_event.wait()
        if False:
            yield "unused"


class BrowserWebsocketServerTests(IsolatedAsyncioTestCase):

    async def test_handler_registration(self):
        """
        Test that registered EventHandlers receive callbacks on new messages.
        """
        event_handler = AsyncMock()
        server = BrowserWebsocketServer()
        server.register_event_handler(event_handler)

        await server._process_inbound_message("""{"event":"sampleEvent"}""")

        event_handler.on_browser_event.assert_called_with(
            {"event": "sampleEvent"})

    async def test_message_broadcast(self):
        """
        Test that outbound messages get broadcasted to all websockets.
        """
        mock_websocket_1 = AsyncMock()
        mock_websocket_2 = AsyncMock()
        server = BrowserWebsocketServer()
        server._ws_clients = [mock_websocket_1, mock_websocket_2]

        await server.send_to_clients("test_message")

        mock_websocket_1.send.assert_called_with("test_message")
        mock_websocket_2.send.assert_called_with("test_message")

    async def test_socket_registration(self):
        """
        Test that new websocket connections get registered and unregistered.
        """
        server = BrowserWebsocketServer()
        mock_websocket = AsyncMock()
        server._register_client = MagicMock()
        server._unregister_client = AsyncMock()

        await server._message_receive_loop(mock_websocket)

        server._register_client.assert_called_with(mock_websocket)
        server._unregister_client.assert_called_with(mock_websocket)
        self.assertNotIn(mock_websocket, server._ws_clients)

    async def test_sockets_gracefully_closed(self):
        """
        Test that websockets get gracefully closed on the plugin side.
        """
        server = BrowserWebsocketServer()
        mock_websocket = AsyncMock()
        server._ws_clients = set([mock_websocket])

        await server._message_receive_loop(mock_websocket)

        mock_websocket.close.assert_called_once()

    async def test_browser_disconnected_callback_called_after_delay(self):
        """
        Test that our EventHandler's on_all_browsers_disconnected is called
        once there are no connected clients for the full debounce window.
        """
        event_handler = AsyncMock()
        server = BrowserWebsocketServer(disconnect_notify_delay_seconds=0.01)
        server.register_event_handler(event_handler)
        mock_websocket = AsyncMock()

        await server._message_receive_loop(mock_websocket)
        event_handler.on_all_browsers_disconnected.assert_not_called()

        await asyncio.sleep(0.02)

        event_handler.on_all_browsers_disconnected.assert_called_with()
        self.assertIsNone(server._disconnect_notify_task)

    async def test_browser_connected_callback_called(self):
        """
        Test that our EventHandler's on_browser_connected is called when the
        first browser client connects.
        """
        event_handler = AsyncMock()
        server = BrowserWebsocketServer()
        server.register_event_handler(event_handler)
        mock_websocket = AsyncMock()

        await server._message_receive_loop(mock_websocket)

        event_handler.on_browser_connected.assert_called_with()

    async def test_browser_disconnected_callback_not_called(self):
        """
        Test that our EventHandler's on_all_browsers_disconnected is not called when
        we still have connected clients.
        """
        event_handler = AsyncMock()
        server = BrowserWebsocketServer()
        mock_websocket_1 = AsyncMock()
        mock_websocket_2 = AsyncMock()
        server.register_event_handler(event_handler)
        server._register_client(mock_websocket_1)

        await server._message_receive_loop(mock_websocket_2)

        event_handler.on_all_browsers_disconnected.assert_not_called()
        event_handler.on_browser_connected.assert_not_called()

    async def test_transient_browser_disconnect_suppressed_within_window(self):
        """
        Test that transient websocket disconnects do not notify handlers when a
        browser reconnects before the debounce window expires.
        """
        event_handler = AsyncMock()
        server = BrowserWebsocketServer(disconnect_notify_delay_seconds=0.05)
        server.register_event_handler(event_handler)

        await server._message_receive_loop(AsyncMock())

        blocking_websocket = BlockingWebsocket()
        reconnect_task = asyncio.create_task(
            server._message_receive_loop(blocking_websocket))
        await asyncio.sleep(0.06)

        event_handler.on_all_browsers_disconnected.assert_not_called()

        blocking_websocket.disconnect()
        await reconnect_task
        server._disconnect_notify_task.cancel()
        await asyncio.sleep(0)

    async def test_disconnect_notification_task_cancelled_on_reconnect(self):
        """
        Test that a pending disconnect notification task is cancelled when a
        new browser websocket reconnects within the debounce window.
        """
        server = BrowserWebsocketServer(disconnect_notify_delay_seconds=0.05)

        await server._message_receive_loop(AsyncMock())
        disconnect_notify_task = server._disconnect_notify_task
        self.assertIsNotNone(disconnect_notify_task)
        self.assertFalse(disconnect_notify_task.done())

        blocking_websocket = BlockingWebsocket()
        reconnect_task = asyncio.create_task(
            server._message_receive_loop(blocking_websocket))
        await asyncio.sleep(0.01)

        self.assertTrue(disconnect_notify_task.cancelled())
        self.assertIsNone(server._disconnect_notify_task)

        blocking_websocket.disconnect()
        await reconnect_task
        server._disconnect_notify_task.cancel()
        await asyncio.sleep(0)

    async def test_socket_messages_read(self):
        """
        Test that our code reads inbound messages from websockets.
        """
        server = BrowserWebsocketServer()
        mock_websocket = AsyncMock()
        mock_websocket.__aiter__.return_value = ["m1", "m2"]
        server._process_inbound_message = AsyncMock()

        await server._message_receive_loop(mock_websocket)

        mock_websocket.__aiter__.assert_called_with()
        server._process_inbound_message.assert_has_calls(
            [call("m1"), call("m2")])

    async def test_handler_exceptions_get_caught(self):
        """
        Test that exceptions thrown by the EventHandler are caught and thus
        don't break our connection.
        """
        event_handler = AsyncMock()
        server = BrowserWebsocketServer()
        server.register_event_handler(event_handler)
        server._logger = MagicMock()  # Suppress logging
        event_handler.on_browser_event.side_effect = Exception(
            "test exception")

        await server._process_inbound_message("[]")
