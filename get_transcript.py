#!/usr/bin/env python3
"""
WonderWords - YouTube Transcript Fetcher
从 YouTube 获取视频字幕的独立脚本
"""

import argparse
import json
import sys
from typing import List, Tuple

from youtube_transcript_api import (
    CouldNotRetrieveTranscript,
    NoTranscriptFound,
    TranscriptsDisabled,
    YouTubeTranscriptApi,
)


def fetch_transcript(video_id: str, languages: List[str]) -> Tuple[List[dict], str]:
    """Fetch transcript using preferred languages."""
    api = YouTubeTranscriptApi()
    transcript_list = api.get_transcript(video_id, languages=languages)
    return transcript_list, languages[0]


def main(argv: List[str]) -> int:
    parser = argparse.ArgumentParser(description="Fetch YouTube transcript")
    parser.add_argument("--video-id", required=True, help="YouTube video ID")
    parser.add_argument(
        "--lang",
        nargs="+",
        default=["en"],
        help="Preferred language codes (default: en)",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output as JSON",
    )
    args = parser.parse_args(argv)

    try:
        transcript, lang_used = fetch_transcript(args.video_id, args.lang)

        if args.json:
            # 输出 JSON 格式
            full_text = " ".join([entry["text"] for entry in transcript])
            output = {
                "success": True,
                "video_id": args.video_id,
                "language": lang_used,
                "text": full_text,
                "length": len(full_text),
                "entries_count": len(transcript),
            }
            print(json.dumps(output, ensure_ascii=False))
        else:
            # 输出可读格式
            print(f"Transcript for {args.video_id} (lang: {lang_used})")
            print("-" * 60)
            for entry in transcript:
                text = entry.get("text", "").replace("\n", " ")
                print(text)

        return 0

    except TranscriptsDisabled:
        error = {"success": False, "error": "Transcripts are disabled for this video"}
        if args.json:
            print(json.dumps(error))
        else:
            print(error["error"], file=sys.stderr)
        return 1

    except NoTranscriptFound:
        error = {"success": False, "error": "No transcript found for this video"}
        if args.json:
            print(json.dumps(error))
        else:
            print(error["error"], file=sys.stderr)
        return 1

    except CouldNotRetrieveTranscript as exc:
        error = {"success": False, "error": f"Failed to retrieve transcript: {exc}"}
        if args.json:
            print(json.dumps(error))
        else:
            print(error["error"], file=sys.stderr)
        return 1

    except Exception as exc:
        error = {"success": False, "error": f"Unexpected error: {exc}"}
        if args.json:
            print(json.dumps(error))
        else:
            print(error["error"], file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
