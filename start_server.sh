#!/bin/bash
# WonderWords 服务器启动脚本

echo "🚀 启动 WonderWords Transcript Server..."

# 激活虚拟环境
source venv/bin/activate

# 启动服务器
python transcript_server.py
