# WonderWords - AI 英语私教 Chrome 插件

## 功能特性

- 🎯 在 YouTube 视频页面自动注入"✨ Analyze Words"按钮
- 📥 智能提取视频英文字幕（使用 youtube-transcript-api）
- 🤖 使用 Google Gemini AI 分析词汇和习语
- ⚙️ **[v1.1 新增]** 自定义难度级别（A1-C2，基于 CEFR 标准）
- 🌍 **[v1.1 新增]** 自定义母语（支持中文、日语、韩语、西班牙语等）
- 💾 设置跨设备同步（Chrome Sync）
- 🎨 精美侧边栏展示单词、定义和原句上下文

## 安装步骤

### 1. 安装 Chrome 扩展

1. 克隆或下载此项目到本地
   ```bash
   git clone https://github.com/Sylviazhou12138/WonderWords.git
   cd WonderWords
   ```

2. 打开 Chrome 浏览器，访问 `chrome://extensions/`
3. 开启右上角"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 WonderWords 项目文件夹

### 2. 安装 Python 服务器（必需）

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

### 3. 配置 Gemini API Key（必需）

WonderWords 使用 Google Gemini AI 进行词汇分析，需要您自己的 API Key。

1. **获取免费 API Key**：
   - 访问 https://aistudio.google.com/apikey
   - 登录 Google 账号
   - 点击 "Create API Key" 创建密钥
   - 复制生成的 API Key

2. **在扩展中配置**：
   - 点击 Chrome 工具栏中的 WonderWords 图标
   - 粘贴 API Key 到输入框
   - 点击 "Save Key" 保存

**注意**：免费配额为每分钟 15 次请求，每天 1500 次请求。如果超出配额，请等待几分钟后重试。

## 使用方法

### 基础使用

1. 确保 Python 服务器正在运行（`./start_server.sh`）
2. 确保已配置 Gemini API Key（见上方说明）
3. 打开任意 YouTube 视频（带英文字幕）
4. 在视频标题旁找到"✨ Analyze Words"按钮
5. 点击按钮，等待 AI 分析（约 5-10 秒）
6. 右侧侧边栏将显示提取的词汇

### 自定义设置 [v1.1]

1. 点击侧边栏右上角的 **⚙️ 设置按钮**
2. 选择你想学习的难度级别：
   - **A1-A2**: 基础/初级词汇（适合初学者）
   - **B1-B2**: 中级/中高级词汇（适合中级学习者）← 默认
   - **C1-C2**: 高级/精通级词汇（适合高级学习者）
3. 选择你的母语（词汇定义将以该语言显示）
4. 点击"Save Settings"保存
5. 重新分析视频以应用新设置

**提示**：设置会自动保存，并在所有登录同一 Google 账号的 Chrome 浏览器间同步。

## 技术实现

### 核心优化

#### 1. 解决重复按钮问题
- 使用 `MutationObserver` 替代 `setInterval`
- 避免定时器缓存导致的"影分身"现象
- 更高效的 DOM 监听机制

#### 2. 多策略字幕获取
- **策略1**: 从页面 `ytInitialPlayerResponse` 提取字幕元数据
- **策略2**: 通过 background.js 绕过 CORS 限制
- **回退机制**: 使用演示数据确保流程可测试

#### 3. 稳定的 AI 调用
- 使用 `gemini-pro` 模型（经过验证稳定可用）
- 增强的 prompt 确保返回有效 JSON
- 完善的错误捕获和用户提示

### 文件结构

```
WonderWords/
├── manifest.json       # 插件配置文件
├── content.js          # 核心逻辑：UI 注入、字幕提取、AI 调用
├── background.js       # 后台服务：处理跨域请求
├── popup.html          # 设置页面
├── popup.js            # 设置逻辑
└── README.md           # 说明文档
```

## 已知限制与解决方案

### 字幕获取问题

**问题**: YouTube 的反爬虫机制可能阻止字幕获取

**解决方案**:
1. 插件优先使用页面已加载的字幕元数据（最可靠）
2. 通过 background.js 发送请求，携带正确的 headers
3. 对于无字幕视频，提供友好的错误提示

**建议测试视频**:
- 大多数官方频道视频（如 TED、BBC）
- 带有 CC 标记的视频
- 英语教学类视频

### API 限制

**Gemini API 配额**:
- 免费层：每分钟 15 次请求
- 如遇 429 错误，请稍后重试
- 建议间隔 5 秒以上使用

## 开发调试

### 查看日志
```javascript
// 在 YouTube 页面打开控制台 (F12)
// 查找带有 emoji 标识的日志：
🚀 WonderWords: Enhanced Version Loaded
📥 开始获取字幕...
✅ 找到字幕轨道: English
✅ 字幕提取成功，长度: 12345
🤖 AI 原始响应: [...]
```

### 常见问题

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

## 更新日志

### v1.1 (2025-12-11) - 当前版本
- ✨ **新功能**: 难度级别选择（A1-C2，基于 CEFR 标准）
- 🌍 **新功能**: 母语选择（中文、日语、韩语、西班牙语、法语、德语、英语）
- ⚙️ 设置界面（侧边栏右上角齿轮图标）
- 💾 设置持久化和跨设备同步（Chrome Storage Sync API）
- 🎨 UI 改进（更宽的侧边栏、更好的卡片设计、彩色按钮）
- 🤖 动态 AI prompt（根据用户设置调整）

### v1.0 (2025-12-07)
- ✅ 首个完整工作版本
- ✅ YouTube 字幕提取（subprocess + youtube-transcript-api）
- ✅ Google Gemini AI 集成（多模型回退）
- ✅ Flask 本地服务器架构
- ✅ 完善的错误处理和用户提示
- ✅ MutationObserver 动态注入按钮

详见 [VERSION.md](VERSION.md) 获取完整版本历史。

## 技术栈

- Chrome Extension Manifest V3
- Vanilla JavaScript
- Python 3 + Flask + youtube-transcript-api
- Google Gemini API (v1beta)
- Chrome Storage Sync API
- MutationObserver API

## 许可证

MIT License
