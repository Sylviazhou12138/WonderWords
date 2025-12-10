#!/bin/bash
# WonderWords 服务器快速安装脚本

echo "🚀 WonderWords 服务器安装脚本"
echo "================================"

# 1. 创建虚拟环境
echo "📦 创建虚拟环境..."
python3 -m venv venv

# 2. 激活虚拟环境并安装依赖
echo "📥 安装依赖包..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "✅ 安装完成！"
echo ""
echo "现在运行以下命令启动服务器："
echo "  ./start_server.sh"
echo ""
echo "或者手动启动："
echo "  source venv/bin/activate"
echo "  python transcript_server.py"
