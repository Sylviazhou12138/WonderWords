"""
WonderWords - Vercel Serverless Function
获取 YouTube 视频字幕的 API 端点
"""

from flask import Flask, jsonify, request
from youtube_transcript_api import (
    CouldNotRetrieveTranscript,
    NoTranscriptFound,
    TranscriptsDisabled,
    YouTubeTranscriptApi,
)

app = Flask(__name__)


@app.route("/api/transcript", methods=["GET"])
def get_transcript():
    """
    获取指定视频的字幕
    URL: /api/transcript?video_id={video_id}
    或: /transcript/{video_id}
    """
    # 从 query 参数或路径获取 video_id
    video_id = request.args.get("video_id") or request.view_args.get("video_id")

    if not video_id:
        return jsonify({"success": False, "error": "Missing video_id parameter"}), 400

    try:
        print(f"📥 获取视频 {video_id} 的字幕...")

        # 直接调用 API（在 Vercel 环境中可行）
        api = YouTubeTranscriptApi()
        transcript_list = api.list_transcripts(video_id)

        # 优先获取英文字幕
        try:
            transcript = transcript_list.find_transcript(["en"])
        except:
            # 如果没有英文字幕，获取第一个可用的字幕
            transcript = next(iter(transcript_list))

        # 获取字幕数据
        transcript_data = transcript.fetch()

        # 拼接完整文本
        full_text = " ".join([entry["text"] for entry in transcript_data])

        result = {
            "success": True,
            "video_id": video_id,
            "language": transcript.language_code,
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


# Vercel 需要这个
def handler(request):
    with app.request_context(request.environ):
        return app.full_dispatch_request()
