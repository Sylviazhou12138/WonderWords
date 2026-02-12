# WonderWords - AI-Powered English Vocabulary Learning Chrome Extension

> **Transform YouTube into Your Personal English Tutor**  
> WonderWords is a Chrome extension that uses AI to extract and explain advanced vocabulary from any YouTube video with subtitles. Learn in context, at your own pace, in your native language.

**[English](#english) | [中文](#中文)**

---

<a name="english"></a>
## English

### 🎯 What is WonderWords?

WonderWords is an intelligent Chrome extension designed to help English learners discover and master advanced vocabulary while watching YouTube videos. By combining automatic subtitle extraction with Google Gemini AI, it identifies challenging words and phrases tailored to your learning level (A1-C2) and provides definitions in your native language.

**Why WonderWords?**
- 📺 **Learn from Real Content**: Study vocabulary from authentic videos you're already interested in
- 🎓 **Personalized Learning**: Choose your difficulty level and native language for customized results
- 💡 **Context is Everything**: See words used in real sentences, not just definitions
- 🚀 **Instant Analysis**: Get AI-powered vocabulary insights in seconds
- 🌍 **Multi-language Support**: Definitions available in 7 languages (Chinese, Japanese, Korean, Spanish, French, German, English)

### ✨ Key Features

- 🎯 Auto-inject "✨ Analyze Words" button on YouTube video pages
- 📥 Intelligently extract English subtitles from videos (using youtube-transcript-api)
- 🤖 Analyze vocabulary and idioms using Google Gemini AI
- ⚙️ **[v1.1 NEW]** Customizable difficulty levels (A1-C2) and native language selection
- 💾 Settings sync across devices (Chrome Sync)
- 🎨 Beautiful sidebar displaying words, definitions, and context

### Installation

#### 1. Install Chrome Extension

1. Clone or download this project
   ```bash
   git clone https://github.com/Sylviazhou12138/WonderWords.git
   cd WonderWords
   ```

2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (top-right corner)
4. Click "Load unpacked"
5. Select the WonderWords project folder

#### 2. Install Python Server (Required)

WonderWords requires a local Python server to fetch YouTube subtitles.

```bash
# Run the one-click installation script
chmod +x setup.sh
./setup.sh

# Start the server
chmod +x start_server.sh
./start_server.sh
```

The server will run at `http://localhost:5001`. See [SERVER_SETUP.md](SERVER_SETUP.md) for details.

#### 3. Ready to Use!

WonderWords v1.5 comes with a built-in API Key - no configuration needed! Just install and start learning.

**Note**: If you encounter rate limiting (429 errors), the extension will automatically retry. For heavy usage, you can get your own free API Key at https://aistudio.google.com/apikey

### Usage

1. Ensure the Python server is running (`./start_server.sh`)
2. Open any YouTube video with English subtitles
3. Click the "✨ Analyze Words" button near the video title
4. Wait for AI analysis (5-10 seconds)
5. Browse vocabulary in the sidebar, click timestamps to jump to context

**Settings**: Click ⚙️ in the sidebar to adjust difficulty level (A1-C2) and definition language.

### Technical Implementation

#### Core Optimizations

##### 1. Solve Duplicate Button Issue
- Use `MutationObserver` instead of `setInterval`
- Avoid timer cache causing "shadow clone" phenomenon
- More efficient DOM monitoring mechanism

##### 2. Multi-Strategy Subtitle Fetching
- **Strategy 1**: Extract subtitle metadata from page's `ytInitialPlayerResponse`
- **Strategy 2**: Bypass CORS restrictions via background.js
- **Fallback**: Use demo data to ensure testability

##### 3. Stable AI Calls
- Use `gemini-pro` model (verified stable and available)
- Enhanced prompts ensure valid JSON responses
- Comprehensive error catching and user feedback

#### File Structure

```
WonderWords/
├── manifest.json       # Extension configuration
├── content.js          # Core logic: UI injection, subtitle extraction, AI calls
├── background.js       # Background service: handle cross-origin requests
├── popup.html          # Settings page
├── popup.js            # Settings logic
└── README.md           # Documentation
```

### Known Limitations & Solutions

#### Subtitle Fetching Issues

**Problem**: YouTube's anti-bot mechanisms may block subtitle fetching

**Solutions**:
1. Extension prioritizes using pre-loaded subtitle metadata from the page (most reliable)
2. Send requests via background.js with proper headers
3. Provide friendly error messages for videos without subtitles

**Recommended Test Videos**:
- Most official channel videos (e.g., TED, BBC)
- Videos with CC badge
- English learning videos

#### API Limitations

**Gemini API Quotas**:
- Free tier: 15 requests per minute
- If you encounter 429 errors, please retry later
- Recommended to wait 5+ seconds between uses

### Development & Debugging

#### View Logs
```javascript
// Open Console (F12) on YouTube page
// Look for logs with emoji markers:
🚀 WonderWords: Enhanced Version Loaded
📥 Starting to fetch subtitles...
✅ Found subtitle track: English
✅ Subtitle extraction successful, length: 12345
🤖 AI raw response: [...]
```

#### Common Issues

1. **Button doesn't appear**
   - Refresh the page and wait 2-3 seconds
   - Check console for errors
   - Confirm you're on a youtube.com/watch page

2. **Subtitle fetching fails**
   - Check if the video has English subtitles (CC button)
   - Try other videos
   - Check console for detailed error messages

3. **AI returns 404**
   - Verify your API Key is correct
   - Check network connection
   - Confirm Gemini API is enabled

### Changelog

#### v1.5 (2025-02-11) - Current Version
- 🔑 **Zero Config**: Built-in API Key, no user configuration required
- ⚡ **429 Auto-Retry**: Automatic retry with backoff when rate limited
- 🔧 **JSON Repair**: Robust JSON parsing that extracts words even from truncated responses
- 🎯 **Better Timestamps**: Improved timestamp matching with substring support
- 🐛 **Bug Fixes**: Fixed popup encoding issues, improved error handling

#### v1.4 (2025-02-10)
- 🔑 Built-in API Key (zero configuration)
- 🎨 Simplified popup (settings only, no API key input)
- ⚡ 429 rate limit auto-retry mechanism
- 📝 Optimized prompts for better context explanations

#### v1.1 (2025-12-11)
- ✨ **New Feature**: Difficulty level selection (A1-C2, based on CEFR standards)
- 🌍 **New Feature**: Native language selection (Chinese, Japanese, Korean, Spanish, French, German, English)
- ⚙️ Settings UI (gear icon in sidebar top-right)
- 💾 Settings persistence and cross-device sync (Chrome Storage Sync API)
- 🎨 UI improvements (wider sidebar, better card design, colorful buttons)
- 🤖 Dynamic AI prompts (adjusted based on user settings)

#### v1.0 (2025-12-07)
- ✅ First complete working version
- ✅ YouTube subtitle extraction (subprocess + youtube-transcript-api)
- ✅ Google Gemini AI integration (multi-model fallback)
- ✅ Flask local server architecture
- ✅ Comprehensive error handling and user feedback
- ✅ MutationObserver dynamic button injection

See [VERSION.md](VERSION.md) for complete version history.

### Tech Stack

- Chrome Extension Manifest V3
- Vanilla JavaScript
- Python 3 + Flask + youtube-transcript-api
- Google Gemini API (v1beta)
- Chrome Storage Sync API
- MutationObserver API

### License

MIT License

---

<a name="中文"></a>
## 中文

### 🎯 什么是 WonderWords？

WonderWords 是一款智能 Chrome 扩展，旨在帮助英语学习者在观看 YouTube 视频时发现并掌握高级词汇。通过结合自动字幕提取和 Google Gemini AI，它能识别符合你学习水平（A1-C2）的具有挑战性的单词和短语，并提供母语定义。

**为什么选择 WonderWords？**
- 📺 **从真实内容中学习**：从你感兴趣的真实视频中学习词汇
- 🎓 **个性化学习**：选择你的难度级别和母语，获得定制化结果
- 💡 **语境至关重要**：在真实句子中看到单词的使用，而不仅仅是定义
- 🚀 **即时分析**：在几秒钟内获得 AI 驱动的词汇洞察
- 🌍 **多语言支持**：提供 7 种语言的定义（中文、日语、韩语、西班牙语、法语、德语、英语）

### ✨ 核心功能

- 🎯 在 YouTube 视频页面自动注入"✨ Analyze Words"按钮
- 📥 智能提取视频英文字幕（使用 youtube-transcript-api）
- 🤖 使用 Google Gemini AI 分析词汇和习语
- ⚙️ **[v1.1 新增]** 可自定义难度级别（A1-C2）和母语选择
- 💾 设置跨设备同步（Chrome Sync）
- 🎨 精美侧边栏展示单词、定义和原句上下文

### 安装步骤

#### 1. 安装 Chrome 扩展

1. 克隆或下载此项目到本地
   ```bash
   git clone https://github.com/Sylviazhou12138/WonderWords.git
   cd WonderWords
   ```

2. 打开 Chrome 浏览器，访问 `chrome://extensions/`
3. 开启右上角"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 WonderWords 项目文件夹

#### 2. 安装 Python 服务器（必需）

WonderWords 需要一个本地 Python 服务器来获取 YouTube 字幕。

```bash
# 运行一键安装脚本
chmod +x setup.sh
./setup.sh

# 启动服务器
chmod +x start_server.sh
./start_server.sh
```

服务器将在 `http://localhost:5001` 运行。详见 [SERVER_SETUP.md](SERVER_SETUP.md)

#### 3. 开始使用！

WonderWords v1.5 内置了 API Key，无需任何配置！安装即可开始学习。

**注意**：如果遇到限流（429 错误），扩展会自动重试。如需大量使用，可以在 https://aistudio.google.com/apikey 获取自己的免费 API Key。

### 使用方法

1. 确保 Python 服务器正在运行（`./start_server.sh`）
2. 打开任意 YouTube 视频（带英文字幕）
3. 点击视频标题旁的"✨ Analyze Words"按钮
4. 等待 AI 分析（约 5-10 秒）
5. 在侧边栏浏览词汇，点击时间戳可跳转到对应位置

**设置**：点击侧边栏的 ⚙️ 可调整难度级别（A1-C2）和释义语言。

### 技术实现

#### 核心优化

##### 1. 解决重复按钮问题
- 使用 `MutationObserver` 替代 `setInterval`
- 避免定时器缓存导致的"影分身"现象
- 更高效的 DOM 监听机制

##### 2. 多策略字幕获取
- **策略1**: 从页面 `ytInitialPlayerResponse` 提取字幕元数据
- **策略2**: 通过 background.js 绕过 CORS 限制
- **回退机制**: 使用演示数据确保流程可测试

##### 3. 稳定的 AI 调用
- 使用 `gemini-pro` 模型（经过验证稳定可用）
- 增强的 prompt 确保返回有效 JSON
- 完善的错误捕获和用户提示

#### 文件结构

```
WonderWords/
├── manifest.json       # 插件配置文件
├── content.js          # 核心逻辑：UI 注入、字幕提取、AI 调用
├── background.js       # 后台服务：处理跨域请求
├── popup.html          # 设置页面
├── popup.js            # 设置逻辑
└── README.md           # 说明文档
```

### 已知限制与解决方案

#### 字幕获取问题

**问题**: YouTube 的反爬虫机制可能阻止字幕获取

**解决方案**:
1. 插件优先使用页面已加载的字幕元数据（最可靠）
2. 通过 background.js 发送请求，携带正确的 headers
3. 对于无字幕视频，提供友好的错误提示

**建议测试视频**:
- 大多数官方频道视频（如 TED、BBC）
- 带有 CC 标记的视频
- 英语教学类视频

#### API 限制

**Gemini API 配额**:
- 免费层：每分钟 15 次请求
- 如遇 429 错误，请稍后重试
- 建议间隔 5 秒以上使用

### 开发调试

#### 查看日志
```javascript
// 在 YouTube 页面打开控制台 (F12)
// 查找带有 emoji 标识的日志：
🚀 WonderWords: Enhanced Version Loaded
📥 开始获取字幕...
✅ 找到字幕轨道: English
✅ 字幕提取成功，长度: 12345
🤖 AI 原始响应: [...]
```

#### 常见问题

1. **按钮不显示**
   - 刷新页面并等待 2-3 秒
   - 检查控制台是否有错误
   - 确认在 youtube.com/watch 页面

2. **字幕获取失败**
   - 检查视频是否有英文字幕（CC 按钮）
   - 尝试其他视频
   - 查看控制台的详细错误信息

3. **AI 返回 404**
   - 确认 API Key 正确
   - 检查网络连接
   - 确认 Gemini API 已启用

### 更新日志

#### v1.5 (2025-02-11) - 当前版本
- 🔑 **零配置**: 内置 API Key，用户无需任何配置即可使用
- ⚡ **429 自动重试**: 遇到限流时自动等待重试
- 🔧 **JSON 修复**: 即使 AI 响应被截断也能提取完整词汇
- 🎯 **时间戳优化**: 改进时间戳匹配，支持子串匹配
- 🐛 **Bug 修复**: 修复弹窗编码问题，改进错误处理

#### v1.4 (2025-02-10)
- 🔑 内置 API Key（零配置）
- 🎨 简化弹窗（仅设置，无需输入 API Key）
- ⚡ 429 限流自动重试机制
- 📝 优化 Prompt，改进语境解释

#### v1.1 (2025-12-11)
- ✨ **新功能**: 难度级别选择（A1-C2，基于 CEFR 标准）
- 🌍 **新功能**: 母语选择（中文、日语、韩语、西班牙语、法语、德语、英语）
- ⚙️ 设置界面（侧边栏右上角齿轮图标）
- 💾 设置持久化和跨设备同步（Chrome Storage Sync API）
- 🎨 UI 改进（更宽的侧边栏、更好的卡片设计、彩色按钮）
- 🤖 动态 AI prompt（根据用户设置调整）

#### v1.0 (2025-12-07)
- ✅ 首个完整工作版本
- ✅ YouTube 字幕提取（subprocess + youtube-transcript-api）
- ✅ Google Gemini AI 集成（多模型回退）
- ✅ Flask 本地服务器架构
- ✅ 完善的错误处理和用户提示
- ✅ MutationObserver 动态注入按钮

详见 [VERSION.md](VERSION.md) 获取完整版本历史。

### 技术栈

- Chrome Extension Manifest V3
- Vanilla JavaScript
- Python 3 + Flask + youtube-transcript-api
- Google Gemini API (v1beta)
- Chrome Storage Sync API
- MutationObserver API

### 许可证

MIT License
