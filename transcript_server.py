#!/usr/bin/env python3
"""
WonderWords - YouTube Transcript API Server (v4.0)
通过调用独立 Python 脚本获取字幕（绕过 Flask 限制）
"""

import json
import os
import subprocess

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 获取脚本路径
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
TRANSCRIPT_SCRIPT = os.path.join(SCRIPT_DIR, "get_transcript.py")

# 在 Render 等生产环境中，使用系统 Python
# 在本地开发时，使用虚拟环境
if os.path.exists(os.path.join(SCRIPT_DIR, "venv", "bin", "python")):
    VENV_PYTHON = os.path.join(SCRIPT_DIR, "venv", "bin", "python")
else:
    VENV_PYTHON = "python3"


@app.route("/transcript/<video_id>", methods=["GET"])
def get_transcript(video_id):
    """
    获取指定视频的字幕
    URL: http://localhost:5001/transcript/{video_id}
    """
    try:
        print(f"📥 获取视频 {video_id} 的字幕...")

        # 调用独立的 Python 脚本
        result = subprocess.run(
            [
                VENV_PYTHON,
                TRANSCRIPT_SCRIPT,
                "--video-id",
                video_id,
                "--lang",
                "en",
                "--json",
            ],
            capture_output=True,
            text=True,
            timeout=30,
        )

        if result.returncode == 0:
            # 成功获取字幕
            data = json.loads(result.stdout)
            print(f"✅ 成功: {data.get('length')} 字符, {data.get('entries_count')} 条")
            return jsonify(data)
        else:
            # 获取失败
            try:
                error_data = json.loads(result.stdout)
                print(f"❌ 失败: {error_data.get('error')}")
                return jsonify(error_data), 404
            except:
                print(f"❌ 失败: {result.stderr}")
                return jsonify(
                    {"success": False, "error": result.stderr or "Unknown error"}
                ), 500

    except subprocess.TimeoutExpired:
        print(f"❌ 超时")
        return jsonify({"success": False, "error": "Request timeout"}), 504

    except Exception as e:
        import traceback

        error_trace = traceback.format_exc()
        print(f"❌ 错误: {e}\n{error_trace}")
        return jsonify({"success": False, "error": str(e), "trace": error_trace}), 500


@app.route("/health", methods=["GET"])
def health_check():
    """健康检查端点"""
    return jsonify(
        {
            "status": "running",
            "service": "WonderWords Transcript API v4.0",
            "method": "subprocess call",
        }
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print("🚀 WonderWords Transcript Server v4.0 启动中...")
    print("🔧 使用独立脚本调用方式（绕过 Flask 限制）")
    print(f"📡 访问地址: http://0.0.0.0:{port}")
    print(f"💡 测试: http://localhost:{port}/transcript/dQw4w9WgXcQ")
    print("⏹  停止服务: Ctrl+C")
    print("")
    app.run(host="0.0.0.0", port=port, debug=False)
