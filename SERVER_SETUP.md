# WonderWords Transcript Server 设置指南

## 快速启动（3 步）

### 1️⃣ 安装依赖

打开终端，进入 WonderWords 文件夹：

```bash
cd /Users/sylviazhou/Desktop/WonderWords
```

安装 Python 包：

```bash
pip3 install -r requirements.txt
```

### 2️⃣ 启动服务器

```bash
python3 transcript_server.py
```

你应该看到：
```
🚀 WonderWords Transcript Server 启动中...
📡 访问地址: http://localhost:5000
💡 测试: http://localhost:5000/transcript/dQw4w9WgXcQ
⏹  停止服务: Ctrl+C
```

### 3️⃣ 测试服务器

在浏览器打开：
```
http://localhost:5000/health
```

应该返回：
```json
{
  "status": "running",
  "service": "WonderWords Transcript API"
}
```

测试获取字幕：
```
http://localhost:5000/transcript/dQw4w9WgXcQ
```

## API 使用说明

### 端点：获取字幕

**URL:** `http://localhost:5000/transcript/{video_id}`

**方法:** `GET`

**示例:**
```
http://localhost:5000/transcript/gEKAzZEJIQY
```

**成功响应:**
```json
{
  "success": true,
  "video_id": "gEKAzZEJIQY",
  "language": "en",
  "text": "完整的字幕文本...",
  "length": 5432,
  "entries_count": 234
}
```

**失败响应:**
```json
{
  "success": false,
  "error": "No transcript found for this video"
}
```

## 常见问题

### Q: 如何停止服务器？
A: 在终端按 `Ctrl+C`

### Q: 端口 5000 被占用怎么办？
A: 修改 `transcript_server.py` 最后一行，将 `5000` 改为其他端口，如 `5001`

### Q: 如何在后台运行？
A: 使用 nohup：
```bash
nohup python3 transcript_server.py &
```

停止后台进程：
```bash
pkill -f transcript_server.py
```
