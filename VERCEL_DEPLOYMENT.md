# WonderWords - Vercel 部署指南

## 📌 部署步骤

### 1. 准备工作

确保你已经：
- ✅ 注册了 [Vercel 账号](https://vercel.com)
- ✅ 安装了 Git
- ✅ 项目已推送到 GitHub

### 2. 项目结构

部署到 Vercel 后的项目结构：

```
WonderWords/
├── api/                    # Vercel Serverless Functions
│   ├── transcript.py      # 字幕获取 API
│   └── health.py          # 健康检查 API
├── vercel.json            # Vercel 配置文件
├── requirements.txt       # Python 依赖
├── content.js             # Chrome Extension 脚本
├── manifest.json          # Extension 配置
└── ...其他文件
```

### 3. 部署方法

#### 方法 A：通过 Vercel Dashboard（推荐）

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **"Add New Project"**
3. 选择 **"Import Git Repository"**
4. 选择你的 `WonderWords` 仓库
5. 配置项目：
   - **Framework Preset**: Other
   - **Root Directory**: `./`（保持默认）
   - **Build Command**: 留空
   - **Output Directory**: 留空
6. 点击 **"Deploy"**

#### 方法 B：通过 Vercel CLI

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 在项目目录下部署
cd /Users/sylviazhou/Desktop/WonderWords
vercel

# 4. 按提示操作：
# - Set up and deploy? Yes
# - Which scope? [选择你的账号]
# - Link to existing project? No
# - What's your project's name? wonderwords
# - In which directory is your code located? ./
# - Want to override settings? No

# 5. 部署成功后，会显示 URL：
# ✅ Production: https://wonderwords.vercel.app
```

### 4. 获取 API URL

部署成功后，Vercel 会提供一个 URL，例如：

```
https://wonderwords-xxxx.vercel.app
```

你的 API 端点会是：

- **字幕获取**: `https://wonderwords-xxxx.vercel.app/transcript/{video_id}`
- **健康检查**: `https://wonderwords-xxxx.vercel.app/health`

### 5. 更新 Chrome Extension 配置

<function_calls>
<invoke name="mcp__acp__Read">
<parameter name="file_path">/Users/sylviazhou/Desktop/WonderWords/content.js