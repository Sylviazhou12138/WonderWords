# WonderWords v1.1 测试指南

## 新功能测试

### 功能 1：难度级别选择

**测试步骤：**

1. 重新加载扩展（chrome://extensions -> 刷新按钮）
2. 打开任意 YouTube 视频
3. 点击 "✨ Analyze Words" 按钮
4. 在侧边栏中点击右上角的 ⚙️ 设置按钮
5. 查看 "Difficulty Level" 下拉菜单

**预期结果：**
- 应该看到 6 个选项：
  - A1 - Beginner (基础词汇)
  - A2 - Elementary (初级词汇)
  - B1 - Intermediate (中级词汇)
  - B2 - Upper Intermediate (中高级词汇) ← 默认
  - C1 - Advanced (高级词汇)
  - C2 - Proficiency (精通级词汇)

**测试用例：**
1. 选择 A1，保存，重新分析 → 应该返回简单词汇
2. 选择 C2，保存，重新分析 → 应该返回高级词汇
3. 关闭侧边栏，重新打开 → 设置应该被保存

---

### 功能 2：母语选择

**测试步骤：**

1. 在设置面板中查看 "Native Language" 下拉菜单
2. 选择不同语言

**预期结果：**
- 应该看到 7 个语言选项：
  - 中文 (Chinese) ← 默认
  - 日本語 (Japanese)
  - 한국어 (Korean)
  - Español (Spanish)
  - Français (French)
  - Deutsch (German)
  - English (English)

**测试用例：**
1. 选择日本語，保存，重新分析 → 定义应该是日语
2. 选择Español，保存，重新分析 → 定义应该是西班牙语
3. 侧边栏顶部应该显示当前设置：`Level: B2 | Language: 中文`

---

## UI 改进测试

### 设置面板
- ⚙️ 按钮应该在右上角
- 点击后显示设置面板，词汇列表隐藏
- "Back to Results" 按钮返回词汇列表
- "Save Settings" 按钮保存并显示确认

### 侧边栏样式
- 宽度从 300px 增加到 350px
- 词汇卡片有蓝色左边框
- 更好的间距和排版
- 关闭按钮是红色的

---

## 测试场景

### 场景 1：首次使用
1. 安装扩展
2. 第一次分析视频
3. **预期：** 使用默认设置 (B2 + Chinese)

### 场景 2：更改设置
1. 更改难度为 C1
2. 更改语言为 Japanese
3. 保存设置
4. **预期：** 侧边栏顶部显示 "Level: C1 | Language: 日本語"

### 场景 3：设置持久化
1. 保存设置后关闭侧边栏
2. 重新分析另一个视频
3. **预期：** 使用上次保存的设置

### 场景 4：跨视频测试
1. 在简单的儿童视频上使用 A1 难度
2. 在 TED Talk 上使用 C2 难度
3. **预期：** AI 应该根据难度返回不同级别的词汇

---

## 已知问题和注意事项

1. **Chrome Storage 同步：** 设置会在所有登录了同一 Google 账号的 Chrome 浏览器间同步
2. **AI 准确性：** Gemini AI 可能不总是严格遵守 CEFR 级别，但应该有明显差异
3. **语言支持：** Gemini 对某些语言的支持可能比其他语言好（中文、日语、西班牙语通常很好）

---

## 调试

如果遇到问题，检查控制台：

```javascript
// 查看当前设置
chrome.storage.sync.get(['difficulty', 'nativeLanguage'], console.log)

// 重置为默认设置
chrome.storage.sync.set({difficulty: 'B2', nativeLanguage: 'Chinese'})
```

打开开发者工具 (F12) 查看：
- Console 标签查看日志：`⚙️ 当前设置: {difficulty: "B2", nativeLanguage: "Chinese"}`
- Network 标签查看 Gemini API 请求的 prompt
