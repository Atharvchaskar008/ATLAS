import sys
import os
import urllib.parse

# Ensure backend directory is in the Python search path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from main import app as fastapi_app

async def app(scope, receive, send):
    """
    Vercel Serverless ASGI entrypoint.
    Unpacks __path__ forwarded by vercel.json rewrite and normalizes scope['path']
    so FastAPI routes (/api/... or /...) match accurately, while preserving
    root and static asset requests for SPA rendering.
    """
    if scope.get("type") in ("http", "websocket"):
        qs_bytes = scope.get("query_string", b"")
        qs = qs_bytes.decode("utf-8", errors="ignore")
        
        path_param = None
        if "__path__=" in qs:
            params = urllib.parse.parse_qsl(qs, keep_blank_values=True)
            remaining_params = []
            for k, v in params:
                if k == "__path__":
                    path_param = v
                else:
                    remaining_params.append((k, v))
            scope["query_string"] = urllib.parse.urlencode(remaining_params).encode("utf-8")
        
        if path_param:
            clean_sub = urllib.parse.unquote(path_param).lstrip("/")
            target = f"/api/{clean_sub}"
        else:
            raw = scope.get("path", "")
            if raw in ("/api/index.py", "/index.py", "/api/index"):
                target = "/"
            else:
                target = raw or "/"

        scope["path"] = target
        scope["raw_path"] = target.encode("utf-8")

    await fastapi_app(scope, receive, send)
