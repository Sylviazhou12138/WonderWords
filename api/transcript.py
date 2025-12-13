"""
WonderWords - Vercel Serverless Function
获取 YouTube 视频字幕的 API 端点
"""

import json
from http.server import BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

from youtube_transcript_api import (
    CouldNotRetrieveTranscript,
    NoTranscriptFound,
    TranscriptsDisabled,
    YouTubeTranscriptApi,
)


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # 解析 URL
        parsed_path = urlparse(self.path)
        query_params = parse_qs(parsed_path.query)

        # 获取 video_id
        video_id = query_params.get("video_id", [None])[0]

        if not video_id:
            self.send_error_response(400, "Missing video_id parameter")
            return

        try:
            print(f"📥 获取视频 {video_id} 的字幕...")

            # 调用 YouTube Transcript API
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
            self.send_success_response(result)

        except TranscriptsDisabled:
            print(f"❌ 字幕已禁用")
            self.send_error_response(404, "Transcripts are disabled for this video")

        except NoTranscriptFound:
            print(f"❌ 未找到字幕")
            self.send_error_response(404, "No transcript found for this video")

        except Exception as e:
            print(f"❌ 错误: {e}")
            self.send_error_response(500, str(e))

    def send_success_response(self, data):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())

    def send_error_response(self, status_code, error_message):
        self.send_response(status_code)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        response = {"success": False, "error": error_message}
        self.wfile.write(json.dumps(response).encode())
