import sys
import os
import urllib.parse

# Ensure backend directory is in the Python search path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from main import app as fastapi_app

MIME_MAP = {
    ".js": "application/javascript",
    ".mjs": "application/javascript",
    ".css": "text/css",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".ico": "image/x-icon",
    ".json": "application/json",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".ttf": "font/ttf",
}

async def app(scope, receive, send):
    """
    Vercel Serverless ASGI entrypoint.
    Unpacks __path__ forwarded by vercel.json rewrite and normalizes scope['path']
    so FastAPI routes (/api/...) match accurately, while serving static assets
    and single-page-application HTML with guaranteed correct MIME types.
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
            if raw in ("/api/index.py", "/index.py", "/api/index", "", "/"):
                target = "/"
            else:
                target = raw or "/"

        scope["path"] = target
        scope["raw_path"] = target.encode("utf-8")

        # 1. Handle Static Assets (/assets/* or /favicon.svg)
        if target.startswith("/assets/") or target in ("/favicon.svg", "/icons.svg"):
            file_name = os.path.basename(target)
            ext = os.path.splitext(file_name)[1].lower()
            content_type = MIME_MAP.get(ext, "application/octet-stream")
            
            candidates = [
                os.path.join(os.path.dirname(__file__), "assets", file_name),
                os.path.join(os.path.dirname(__file__), file_name),
                os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist", "assets", file_name)),
                os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist", file_name)),
            ]
            for candidate in candidates:
                if os.path.exists(candidate) and os.path.isfile(candidate):
                    with open(candidate, "rb") as f:
                        file_bytes = f.read()
                    await send({
                        "type": "http.response.start",
                        "status": 200,
                        "headers": [
                            [b"content-type", content_type.encode("ascii")],
                            [b"cache-control", b"public, max-age=31536000, immutable"],
                            [b"content-length", str(len(file_bytes)).encode("ascii")],
                        ],
                    })
                    await send({
                        "type": "http.response.body",
                        "body": file_bytes,
                    })
                    return

        # 2. Handle Non-API SPA Route / Root (always serve index.html with no-cache)
        if target == "/" or not target.startswith("/api"):
            candidates = [
                os.path.join(os.path.dirname(__file__), "index.html"),
                os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist", "index.html")),
            ]
            for candidate in candidates:
                if os.path.exists(candidate) and os.path.isfile(candidate):
                    with open(candidate, "rb") as f:
                        html_bytes = f.read()
                    await send({
                        "type": "http.response.start",
                        "status": 200,
                        "headers": [
                            [b"content-type", b"text/html; charset=utf-8"],
                            [b"cache-control", b"no-cache, no-store, must-revalidate"],
                            [b"content-length", str(len(html_bytes)).encode("ascii")],
                        ],
                    })
                    await send({
                        "type": "http.response.body",
                        "body": html_bytes,
                    })
                    return

    await fastapi_app(scope, receive, send)
