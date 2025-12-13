"""
WonderWords - Health Check API
"""

import json


def handler(event, context):
    """健康检查端点"""
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps(
            {
                "status": "running",
                "service": "WonderWords Transcript API",
                "version": "v1.1-vercel",
                "environment": "serverless",
            }
        ),
    }
