from unittest import IsolatedAsyncioTestCase
from unittest.mock import AsyncMock, MagicMock, call

from src.browser_websocket_server import BrowserWebsocketServer


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

        await server._message_receive_loop(mock_websocket, "testUri")

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

        await server._message_receive_loop(mock_websocket, "testUri")

        mock_websocket.close.assert_called_once()

    async def test_browser_disconnected_callback_called(self):
        """
        Test that our EventHandler's on_all_browsers_disconnected is called
        once there are no connected clients.
        """
        event_handler = AsyncMock()
        server = BrowserWebsocketServer()
        server.register_event_handler(event_handler)
        mock_websocket = AsyncMock()

        await server._message_receive_loop(mock_websocket, "testUri")

        event_handler.on_all_browsers_disconnected.assert_called_with()

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

        await server._message_receive_loop(mock_websocket_2, "testUri")

        event_handler.on_all_browsers_disconnected.assert_not_called()

    async def test_socket_messages_read(self):
        """
        Test that our code reads inbound messages from websockets.
        """
        server = BrowserWebsocketServer()
        mock_websocket = AsyncMock()
        mock_websocket.__aiter__.return_value = ["m1", "m2"]
        server._process_inbound_message = AsyncMock()

        await server._message_receive_loop(mock_websocket, "testUri")

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
