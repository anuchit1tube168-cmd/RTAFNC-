#!/usr/bin/env python3
from __future__ import annotations

import argparse
import mimetypes
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
ROUTES = {
    "/liff": ROOT / "apps" / "liff",
    "/admin": ROOT / "apps" / "admin",
    "/": ROOT / "portal",
}


def resolve_file(path: str) -> Path | None:
    clean_path = unquote(urlparse(path).path)
    for prefix, base in sorted(ROUTES.items(), key=lambda item: len(item[0]), reverse=True):
        if prefix == "/" or clean_path == prefix or clean_path.startswith(prefix + "/"):
            relative = clean_path[len(prefix):].lstrip("/") if prefix != "/" else clean_path.lstrip("/")
            candidate = (base / relative).resolve()
            if base.resolve() not in candidate.parents and candidate != base.resolve():
                return None
            if candidate.is_dir():
                candidate = candidate / "index.html"
            if candidate.is_file():
                return candidate
            fallback = base / "index.html"
            return fallback if fallback.is_file() else None
    return None


class Handler(BaseHTTPRequestHandler):
    server_version = "RTAFNCPreview/1.0"

    def do_GET(self) -> None:
        if self.path == "/healthz":
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write(b"ok")
            return

        file_path = resolve_file(self.path)
        if not file_path:
            self.send_error(404, "Not found")
            return

        content_type, _ = mimetypes.guess_type(file_path.name)
        self.send_response(200)
        self.send_header("Content-Type", f"{content_type or 'application/octet-stream'}; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.end_headers()
        self.wfile.write(file_path.read_bytes())

    def log_message(self, format: str, *args: object) -> None:
        print(f"[{self.log_date_time_string()}] {format % args}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve RTAFNC portal, LIFF and admin preview")
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=5500)
    args = parser.parse_args()

    server = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"RTAFNC preview: http://localhost:{args.port}")
    print(f"Student LIFF:   http://localhost:{args.port}/liff/")
    print(f"Staff Admin:    http://localhost:{args.port}/admin/")
    server.serve_forever()


if __name__ == "__main__":
    main()
