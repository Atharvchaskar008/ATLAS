import sys
import os

# Ensure backend directory is in the Python search path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Import the FastAPI application
from main import app as fastapi_app

# ASGI wrapper to restore the true request path rewritten by Vercel
async def app(scope, receive, send):
    if scope["type"] in ("http", "websocket"):
        headers = dict(scope.get("headers", []))
        
        # Vercel passes the original user request URI in x-matched-path or x-forwarded-uri
        matched = (
            headers.get(b"x-matched-path", b"")
            or headers.get(b"x-forwarded-uri", b"")
        ).decode("utf-8", errors="ignore")
        
        if not matched:
            route_matches = headers.get(b"x-now-route-matches", b"").decode("utf-8", errors="ignore")
            if "1=" in route_matches:
                for part in route_matches.split("&"):
                    if part.startswith("1="):
                        import urllib.parse
                        sub_path = urllib.parse.unquote(part[2:])
                        matched = "/api/" + sub_path.lstrip("/")
                        break

        current_path = scope.get("path", "")
        
        # If Vercel rewrote path to the function file itself (/api/index.py or /api or /index.py)
        if matched and current_path in ("/api/index.py", "/api", "/index.py", "/", ""):
            target = matched
        elif current_path:
            target = current_path
        else:
            target = matched or "/"
            
        if "?" in target:
            target, qs = target.split("?", 1)
            if not scope.get("query_string"):
                scope["query_string"] = qs.encode("utf-8")
                
        scope["path"] = target

    return await fastapi_app(scope, receive, send)
