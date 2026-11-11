import sys
import os
import json

# Ensure backend directory is in the Python search path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from main import app as fastapi_app

async def app(scope, receive, send):
    if scope.get("type") == "http":
        headers = dict(scope.get("headers", []))
        if b"x-debug" in headers:
            body = json.dumps({
                "scope_path": scope.get("path"),
                "scope_raw_path": scope.get("raw_path", b"").decode("utf-8", "ignore"),
                "scope_query_string": scope.get("query_string", b"").decode("utf-8", "ignore"),
                "headers": {k.decode("utf-8", "ignore"): v.decode("utf-8", "ignore") for k, v in headers.items()}
            }, indent=2).encode("utf-8")
            await send({
                "type": "http.response.start",
                "status": 200,
                "headers": [
                    [b"content-type", b"application/json"],
                    [b"content-length", str(len(body)).encode("utf-8")]
                ]
            })
            await send({
                "type": "http.response.body",
                "body": body
            })
            return
            
    await fastapi_app(scope, receive, send)
