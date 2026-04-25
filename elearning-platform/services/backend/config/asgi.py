import os

from django.core.asgi import get_asgi_application
import socketio

from config.realtime import socket_server


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

django_asgi_app = get_asgi_application()

application = socketio.ASGIApp(socket_server, other_asgi_app=django_asgi_app)
