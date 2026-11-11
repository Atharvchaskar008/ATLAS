import sys
import os
import json
import urllib.parse

# Ensure backend directory is in the Python search path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from main import app as fastapi_app

async def app(scope, receive, send):
    if scope["type"] in ("http", "websocket"):
        headers_list = scope.get("headers", [])
        headers = dict(headers_list)
        
        # Check all possible routing headers provided by Vercel
        matched = (
            headers.get(b"x-matched-path", b"")
            or headers.get(b"x-forwarded-uri", b"")
        ).decode("utf-8", errors="ignore")
        
        if not matched:
            route_matches = headers.get(b"x-now-route-matches", b"").decode("utf-8", errors="ignore")
            if "1=" in route_matches:
                for part in route_matches.split("&"):
                    if part.startswith("1="):
                        sub_path = urllib.parse.unquote(part[2:])
                        matched = "/api/" + sub_path.lstrip("/")
                        break

        current_path = scope.get("path", "")

        # Emergency diagnostic echo endpoint
        if "echo" in current_path or "echo" in matched:
            headers_str = {k.decode("utf-8", "ignore"): v.decode("utf-8", "ignore") for k, v in headers_list}
            data = json.dumps({
                "scope_path_original": current_path,
                "matched_from_headers": matched,
                "headers": headers_str
            }, indent=2).encode("utf-8")
            await send({
                "type": "http.response.start",
                "status": 200,
                "headers": [(b"content-type", b"application/json")]
            })
            await send({
                "type": "http.response.body",
                "body": data
            })
            return

        if matched:
            target = matched
        else:
            target = current_path or "/"
            
        if "?" in target:
            target, qs = target.split("?", 1)
            if not scope.get("query_string"):
                scope["query_string"] = qs.encode("utf-8")
                
        scope["path"] = target

    return await fastapi_app(scope, receive, send)
