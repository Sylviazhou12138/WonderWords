"""
WonderWords - Health Check API
"""

from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/api/health", methods=["GET"])
def health_check():
    """健康检查端点"""
    return jsonify(
        {
            "status": "running",
            "service": "WonderWords Transcript API",
            "version": "v1.1-vercel",
            "environment": "serverless",
        }
    )


# Vercel handler
def handler(request):
    with app.request_context(request.environ):
        return app.full_dispatch_request()
