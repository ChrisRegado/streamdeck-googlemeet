from unittest import IsolatedAsyncioTestCase
from unittest.mock import AsyncMock, MagicMock, call, patch
import websockets

from src.stream_deck_client import StreamDeckWebsocketClient


class StreamDeckWebsocketClientTests(IsolatedAsyncioTestCase):

    @patch("websockets.connect", new_callable=AsyncMock)
    async def test_registration_procedure(self, websocket_connect_mock):
        """
        Tests that the start procedure connects to Stream Deck and performs the
        mandatory Stream plugin registration.
        """
        sd_client = StreamDeckWebsocketClient()
        sd_client._logger = MagicMock()  # Suppress logging
        sd_client.send_outbound_message = AsyncMock()

        await sd_client.start(1111, "registerEvent", "test_uuid")

        websocket_connect_mock.assert_called_with("ws://127.0.0.1:1111")
        sd_client.send_outbound_message.assert_called_once()
        outbound_call = sd_client.send_outbound_message.call_args[0][0]
        self.assertIn("registerEvent", outbound_call)
        self.assertIn("test_uuid", outbound_call)

    async def test_handler_registration(self):
        """
        Test that registered EventHandlers receive callbacks on new events.
        """
        event_handler = AsyncMock()
        sd_client = StreamDeckWebsocketClient()
        sd_client.register_event_handler(event_handler)

        await sd_client._process_inbound_message("""{"event":"sampleEvent"}""")

        event_handler.on_stream_deck_event.assert_called_with(
            {"event": "sampleEvent"})

    async def test_outbound_message(self):
        """
        Test that outbound messages get sent over the Stream Deck websocket.
        """
        mock_websocket = AsyncMock()
        sd_client = StreamDeckWebsocketClient()
        sd_client._websocket = mock_websocket

        await sd_client.send_outbound_message("test_message")

        mock_websocket.send.assert_called_with("test_message")

    async def test_socket_messages_read(self):
        """
        Test that our code reads inbound messages from the websocket.
        """
        sd_client = StreamDeckWebsocketClient()
        mock_websocket = AsyncMock()
        mock_websocket.__aiter__.return_value = ["m1", "m2"]
        sd_client._process_inbound_message = AsyncMock()

        await sd_client._message_receive_loop(mock_websocket)

        mock_websocket.__aiter__.assert_called_with()
        sd_client._process_inbound_message.assert_has_calls(
            [call("m1"), call("m2")])

    async def test_handler_exceptions_get_caught(self):
        """
        Test that exceptions thrown by the EventHandler are caught and thus
        don't break our Stream Deck connection.
        """
        event_handler = AsyncMock()
        sd_client = StreamDeckWebsocketClient()
        sd_client._logger = MagicMock()  # Suppress logging
        sd_client.register_event_handler(event_handler)
        event_handler.on_stream_deck_event.side_effect = Exception(
            "test exception")

        await sd_client._process_inbound_message("[]")
