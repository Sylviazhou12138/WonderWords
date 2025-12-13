"""
WonderWords - Vercel API Entry Point
"""

import json
from http.server import BaseHTTPRequestHandler


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()

        response = {
            "status": "running",
            "service": "WonderWords API",
            "version": "v1.1-vercel",
            "endpoints": {
                "health": "/api/health",
                "transcript": "/api/transcript?video_id=YOUR_VIDEO_ID",
            },
        }

        self.wfile.write(json.dumps(response).encode())
        return
