import os

import socketio


REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

manager = socketio.AsyncRedisManager(REDIS_URL, write_only=False)
socket_server = socketio.AsyncServer(
    async_mode="asgi",
    client_manager=manager,
    cors_allowed_origins="*",
)


@socket_server.event
async def connect(sid, environ, auth):
    return True


@socket_server.event
async def join_tenant_room(sid, data):
    tenant_id = data.get("tenant_id")
    if tenant_id:
        await socket_server.enter_room(sid, tenant_id)


async def publish_tenant_event(tenant_id: str, event: str, payload: dict) -> None:
    await socket_server.emit(event, payload, room=tenant_id)
