# WonderWords 文件结构说明

## 📁 项目结构

```
WonderWords/
├── manifest.json           # Chrome扩展配置文件 - 定义扩展的基本信息、权限和入口
├── content.js              # 核心逻辑 - UI注入、字幕提取、AI调用
├── background.js           # 后台服务 - 处理跨域请求
├── popup.html              # 设置页面 - 用户配置API Key等设置
├── popup.js                # 设置逻辑 - 保存和读取用户设置
│
├── transcript_server.py    # 本地Python服务器 - 获取YouTube字幕
├── requirements.txt        # Python依赖列表
├── setup.sh                # 自动安装脚本 - 一键配置环境
├── start_server.sh         # 启动服务器脚本
│
└── README.md               # 项目说明文档
```

---

## 📄 文件详细说明

### Chrome扩展核心文件

#### `manifest.json`
**作用**: Chrome扩展的配置文件  
**内容**:
- 扩展名称、版本、描述
- 需要的权限（storage、activeTab等）
- 指定content.js和background.js的入口
- 设置页面的配置

---

#### `content.js`
**作用**: 扩展的核心逻辑，运行在YouTube页面上  
**功能**:
1. 在YouTube页面注入WonderWords按钮和UI
2. 提取YouTube视频字幕
3. 调用Google Gemini API分析词汇
4. 显示分析结果（高级/中级/基础词汇）
5. 支持多语言UI和自定义难度

**主要函数**:
- `injectWonderWordsButton()` - 注入按钮到YouTube页面
- `fetchTranscript()` - 获取视频字幕
- `callGeminiAI()` - 调用AI分析词汇
- `displayResults()` - 展示词汇列表

---

#### `background.js`
**作用**: Chrome扩展后台服务  
**功能**:
- 处理跨域请求（CORS）
- 转发对本地Python服务器的请求
- 监听来自content.js的消息

---

#### `popup.html`
**作用**: 扩展的设置页面UI  
**内容**:
- API Key输入框
- 难度级别选择器
- 语言选择器
- 保存按钮

**打开方式**: 点击Chrome工具栏的WonderWords图标

---

#### `popup.js`
**作用**: 设置页面的逻辑  
**功能**:
- 保存用户的API Key、难度、语言设置到Chrome存储
- 读取并显示已保存的设置
- 使用`chrome.storage.sync`实现跨设备同步

---

### Python后端文件

#### `transcript_server.py`
**作用**: 本地Python Flask服务器  
**功能**:
- 接收视频ID，返回YouTube字幕
- 使用`youtube-transcript-api`库获取字幕
- 监听在`http://localhost:5001`

**API接口**:
```
GET /transcript?video_id=xxx
返回: {"text": "字幕内容..."}
```

---

#### `requirements.txt`
**作用**: Python依赖包列表  
**内容**:
```
flask==3.0.0
flask-cors==4.0.0
youtube-transcript-api
```

**安装命令**: `pip install -r requirements.txt`

---

#### `setup.sh`
**作用**: 自动配置脚本  
**功能**:
1. 创建Python虚拟环境（venv）
2. 安装所有依赖
3. 使启动脚本可执行

**使用方法**:
```bash
chmod +x setup.sh
./setup.sh
```

---

#### `start_server.sh`
**作用**: 启动Python服务器的快捷脚本  
**功能**:
- 激活虚拟环境
- 运行`transcript_server.py`

**使用方法**:
```bash
./start_server.sh
```

---

### 文档文件

#### `README.md`
**作用**: 项目说明文档  
**内容**:
- 项目介绍
- 安装步骤
- 使用说明
- 常见问题

---

## 🗂️ 隐藏文件夹（无需关注）

### `venv/`
**作用**: Python虚拟环境  
**说明**: 由`setup.sh`自动创建，包含所有Python依赖包  
**注意**: 不要手动修改，不要提交到Git

### `.git/`
**作用**: Git版本控制文件夹  
**说明**: 存储项目的版本历史

---

## 🚀 快速使用指南

### 1️⃣ 首次安装
```bash
chmod +x setup.sh
./setup.sh
```

### 2️⃣ 启动服务器
```bash
./start_server.sh
```

### 3️⃣ 安装Chrome扩展
1. 打开Chrome → 扩展程序 → 开发者模式
2. 点击"加载已解压的扩展程序"
3. 选择WonderWords文件夹

### 4️⃣ 配置API Key
1. 点击Chrome工具栏的WonderWords图标
2. 输入Gemini API Key
3. 点击保存

### 5️⃣ 开始使用
1. 打开任意YouTube视频
2. 点击视频右下角的"✨ WonderWords"按钮
3. 查看词汇分析结果

---

## ⚠️ 重要提示

- **必须先启动Python服务器**才能使用扩展
- `venv/`文件夹不要删除
- 修改代码后需要在Chrome扩展页面点击"重新加载"
- API Key保存在本地，不会上传到云端
