# Supported via standard GitHub programming aids
"""
WebSocket Connection Manager for PolyMind Chat

Manages WebSocket connections, message routing, and connection lifecycle.
"""

import asyncio
from fastapi import WebSocket, WebSocketDisconnect
from backend.utils.logger import get_async_logger

logger = get_async_logger(__name__)


class ConnectionManager:
    def __init__(self):
        self.active_connections: set[WebSocket] = set()
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        async with self._lock:
            self.active_connections.add(websocket)
        logger.info(f"🔌 New connection. Total: {len(self.active_connections)}")

    async def disconnect(self, websocket: WebSocket):
        async with self._lock:
            if websocket in self.active_connections:
                self.active_connections.remove(websocket)
        logger.info(f"🔌 Connection closed. Remaining: {len(self.active_connections)}")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except (WebSocketDisconnect, RuntimeError):
            await self.disconnect(websocket)

    async def broadcast(self, message: str):
        """Broadcast message to all active connections efficiently"""
        tasks = []
        async with self._lock:
            connections = list(self.active_connections)

        for connection in connections:
            tasks.append(self.send_personal_message(message, connection))

        await asyncio.gather(*tasks, return_exceptions=True)


# Global connection manager instance
ws_connection_manager = ConnectionManager()
