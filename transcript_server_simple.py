#!/usr/bin/env python3
"""
WonderWords - Simple YouTube Transcript API Server
直接调用 API（不使用 subprocess）
"""

import os

from flask import Flask, jsonify
from flask_cors import CORS
from youtube_transcript_api import (
    CouldNotRetrieveTranscript,
    NoTranscriptFound,
    TranscriptsDisabled,
    YouTubeTranscriptApi,
)

app = Flask(__name__)
CORS(app)


@app.route("/transcript/<video_id>", methods=["GET"])
def get_transcript(video_id):
    """
    获取指定视频的字幕
    URL: /transcript/{video_id}
    """
    try:
        print(f"📥 获取视频 {video_id} 的字幕...")

        # 直接调用 API
        transcript_data = YouTubeTranscriptApi.get_transcript(
            video_id, languages=["en"]
        )

        # 拼接完整文本
        full_text = " ".join([entry["text"] for entry in transcript_data])

        result = {
            "success": True,
            "video_id": video_id,
            "language": "en",
            "text": full_text,
            "length": len(full_text),
            "entries_count": len(transcript_data),
        }

        print(f"✅ 成功: {result['length']} 字符, {result['entries_count']} 条")
        return jsonify(result)

    except TranscriptsDisabled:
        print(f"❌ 字幕已禁用")
        return jsonify(
            {"success": False, "error": "Transcripts are disabled for this video"}
        ), 404

    except NoTranscriptFound:
        print(f"❌ 未找到字幕")
        return jsonify(
            {"success": False, "error": "No transcript found for this video"}
        ), 404

    except CouldNotRetrieveTranscript as e:
        print(f"❌ 无法获取字幕: {e}")
        return jsonify(
            {"success": False, "error": f"Could not retrieve transcript: {str(e)}"}
        ), 500

    except Exception as e:
        print(f"❌ 错误: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health_check():
    """健康检查端点"""
    return jsonify(
        {
            "status": "running",
            "service": "WonderWords Transcript API",
            "version": "v1.2-simple",
        }
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print("🚀 WonderWords Simple Server 启动中...")
    print(f"📡 访问地址: http://0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)
