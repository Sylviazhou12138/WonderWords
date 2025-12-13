"""
WonderWords - Vercel Serverless Function
获取 YouTube 视频字幕的 API 端点
"""

from youtube_transcript_api import (
    CouldNotRetrieveTranscript,
    NoTranscriptFound,
    TranscriptsDisabled,
    YouTubeTranscriptApi,
)


def handler(event, context):
    """
    Vercel Serverless Function Handler
    """
    # 从 URL 路径或 query 参数获取 video_id
    video_id = None

    # 尝试从 query 参数获取
    if "queryStringParameters" in event and event["queryStringParameters"]:
        video_id = event["queryStringParameters"].get("video_id")

    # 尝试从路径参数获取
    if not video_id and "pathParameters" in event and event["pathParameters"]:
        video_id = event["pathParameters"].get("video_id")

    # 尝试从路径解析
    if not video_id and "rawPath" in event:
        path = event["rawPath"]
        if "/transcript/" in path:
            video_id = path.split("/transcript/")[-1].split("/")[0].split("?")[0]

    if not video_id:
        return {
            "statusCode": 400,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            "body": '{"success": false, "error": "Missing video_id parameter"}',
        }

    try:
        print(f"📥 获取视频 {video_id} 的字幕...")

        # 直接调用 API
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

        import json

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            "body": json.dumps(result),
        }

    except TranscriptsDisabled:
        print(f"❌ 字幕已禁用")
        return {
            "statusCode": 404,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            "body": '{"success": false, "error": "Transcripts are disabled for this video"}',
        }

    except NoTranscriptFound:
        print(f"❌ 未找到字幕")
        return {
            "statusCode": 404,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            "body": '{"success": false, "error": "No transcript found for this video"}',
        }

    except Exception as e:
        print(f"❌ 错误: {e}")
        import json

        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            "body": json.dumps({"success": False, "error": str(e)}),
        }
