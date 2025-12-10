# WonderWords - AI 英语私教 Chrome 插件

## 功能特性

- 在 YouTube 视频页面自动注入"✨ Analyze Words"按钮
- 智能提取视频英文字幕（支持多种获取策略）
- 使用 Google Gemini AI 分析 B2+ 难度词汇和习语
- 精美侧边栏展示单词、中文释义和原句上下文

## 安装步骤

1. 克隆或下载此项目到本地
2. 打开 Chrome 浏览器，访问 `chrome://extensions/`
3. 开启右上角"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择 WonderWords 项目文件夹

## 配置 API Key

1. 获取 Gemini API Key：
   - 访问 https://aistudio.google.com/apikey
   - 登录 Google 账号并创建 API Key
   - 复制生成的密钥

2. 在插件中配置：
   - 点击 Chrome 工具栏中的 WonderWords 图标
   - 粘贴 API Key 到输入框
   - 点击"Save Key"按钮

## 使用方法

1. 打开任意 YouTube 视频（带英文字幕）
2. 在视频标题旁找到"✨ Analyze Words"按钮
3. 点击按钮，等待 AI 分析（约 5-10 秒）
4. 右侧侧边栏将显示提取的高级词汇和习语

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

### v1.0 (2025-12-06)
- ✅ 修复重复按钮问题（MutationObserver）
- ✅ 多策略字幕提取（2 种方法 + 回退）
- ✅ 完善错误处理和用户提示
- ✅ API Key 安全存储
- ✅ 优化 AI prompt 和响应解析

## 技术栈

- Chrome Extension Manifest V3
- Vanilla JavaScript (无依赖)
- Google Gemini API (gemini-pro)
- Chrome Storage API
- MutationObserver API

## 许可证

MIT License
