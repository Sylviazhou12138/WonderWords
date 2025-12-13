// WonderWords - v1.1 (添加难度和语言选择)
console.log("🚀 WonderWords v1.1 加载成功");

let observer = null;

// 默认设置
const DEFAULT_SETTINGS = {
  difficulty: "B2", // A1, A2, B1, B2, C1, C2
  nativeLanguage: "Chinese", // Chinese, Japanese, Korean, Spanish, French, German
};

// 语言映射
const LANGUAGE_MAP = {
  Chinese: "中文",
  Japanese: "日本語",
  Korean: "한국어",
  Spanish: "Español",
  French: "Français",
  German: "Deutsch",
  English: "English",
};

// 难度级别说明
const DIFFICULTY_DESC = {
  A1: "Beginner (基础词汇)",
  A2: "Elementary (初级词汇)",
  B1: "Intermediate (中级词汇)",
  B2: "Upper Intermediate (中高级词汇)",
  C1: "Advanced (高级词汇)",
  C2: "Proficiency (精通级词汇)",
};

// UI 文本翻译
const UI_TEXT = {
  Chinese: {
    fetchingTranscript: "📥 获取字幕...",
    analyzing: "🤖 AI 分析中...",
    done: "✅ 完成!",
    failed: "❌ 失败",
    reanalyzing: "正在使用新设置重新分析...",
    waitingAPI: "⏳ 等待 API 配额恢复...",
    level: "难度",
    language: "语言",
  },
  Japanese: {
    fetchingTranscript: "📥 字幕を取得中...",
    analyzing: "🤖 AI 分析中...",
    done: "✅ 完了!",
    failed: "❌ 失敗",
    reanalyzing: "新しい設定で再分析中...",
    waitingAPI: "⏳ API クォータ回復待ち...",
    level: "レベル",
    language: "言語",
  },
  Korean: {
    fetchingTranscript: "📥 자막 가져오는 중...",
    analyzing: "🤖 AI 분석 중...",
    done: "✅ 완료!",
    failed: "❌ 실패",
    reanalyzing: "새 설정으로 재분석 중...",
    waitingAPI: "⏳ API 할당량 복구 대기 중...",
    level: "레벨",
    language: "언어",
  },
  Spanish: {
    fetchingTranscript: "📥 Obteniendo subtítulos...",
    analyzing: "🤖 Analizando con IA...",
    done: "✅ ¡Listo!",
    failed: "❌ Error",
    reanalyzing: "Reanalizando con nueva configuración...",
    waitingAPI: "⏳ Esperando recuperación de cuota API...",
    level: "Nivel",
    language: "Idioma",
  },
  French: {
    fetchingTranscript: "📥 Récupération des sous-titres...",
    analyzing: "🤖 Analyse IA...",
    done: "✅ Terminé!",
    failed: "❌ Échec",
    reanalyzing: "Réanalyse avec nouveaux paramètres...",
    waitingAPI: "⏳ En attente de récupération du quota API...",
    level: "Niveau",
    language: "Langue",
  },
  German: {
    fetchingTranscript: "📥 Untertitel abrufen...",
    analyzing: "🤖 KI-Analyse...",
    done: "✅ Fertig!",
    failed: "❌ Fehler",
    reanalyzing: "Neuanalyse mit neuen Einstellungen...",
    waitingAPI: "⏳ Warte auf API-Quota-Wiederherstellung...",
    level: "Stufe",
    language: "Sprache",
  },
  English: {
    fetchingTranscript: "📥 Fetching transcript...",
    analyzing: "🤖 AI analyzing...",
    done: "✅ Done!",
    failed: "❌ Failed",
    reanalyzing: "Re-analyzing with new settings...",
    waitingAPI: "⏳ Waiting for API quota recovery...",
    level: "Level",
    language: "Language",
  },
};

// 获取设置
async function getSettings() {
  return new Promise((resolve) => {
    try {
      chrome.storage.sync.get(DEFAULT_SETTINGS, (items) => {
        if (chrome.runtime.lastError) {
          console.warn("⚠️ Chrome storage error:", chrome.runtime.lastError);
          resolve(DEFAULT_SETTINGS);
        } else {
          resolve(items);
        }
      });
    } catch (error) {
      console.warn("⚠️ Extension context error:", error);
      resolve(DEFAULT_SETTINGS);
    }
  });
}

// 保存设置
async function saveSettings(settings) {
  return new Promise((resolve) => {
    try {
      chrome.storage.sync.set(settings, () => {
        if (chrome.runtime.lastError) {
          console.warn("⚠️ Chrome storage error:", chrome.runtime.lastError);
        } else {
          console.log("✅ 设置已保存:", settings);
        }
        resolve();
      });
    } catch (error) {
      console.warn("⚠️ Extension context error:", error);
      resolve();
    }
  });
}

function injectButton() {
  const owner = document.querySelector("#owner");
  if (owner && !document.getElementById("wonderwords-btn")) {
    const btn = document.createElement("button");
    btn.id = "wonderwords-btn";
    btn.textContent = "✨ Analyze Words";
    btn.style.cssText =
      "background-color: #3ea6ff; color: black; border: none; padding: 8px 16px; margin-left: 10px; border-radius: 18px; font-weight: bold; cursor: pointer; font-family: Roboto, Arial;";

    btn.onclick = startProcess;
    owner.appendChild(btn);
    console.log("✅ 按钮注入成功");
  }
}

function initObserver() {
  if (observer) observer.disconnect();
  observer = new MutationObserver(() => injectButton());
  observer.observe(document.body, { childList: true, subtree: true });
  injectButton();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initObserver);
} else {
  initObserver();
}

async function startProcess() {
  const btn = document.getElementById("wonderwords-btn");
  const originalText = btn.textContent;

  try {
    // 获取用户设置
    const settings = await getSettings();
    // 按钮始终使用英文
    const uiText = UI_TEXT.English;

    btn.textContent = uiText.fetchingTranscript;
    btn.disabled = true;

    // 获取 video ID
    const videoId = new URLSearchParams(window.location.search).get("v");
    if (!videoId) {
      throw new Error("无法获取视频 ID");
    }

    console.log("📹 Video ID:", videoId);

    // 从本地 API 获取字幕
    const response = await fetch(
      `https://wonderwords-api.onrender.com/transcript/${videoId}`,
    );
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "获取字幕失败");
    }

    console.log("📝 字幕长度:", data.length);

    btn.textContent = uiText.analyzing;

    console.log("⚙️ 当前设置:", settings);

    // 调用 AI 分析
    const words = await callGeminiAI(data.text, settings);

    if (!words || words.length === 0) {
      throw new Error("AI 未返回结果");
    }

    // 显示侧边栏（传递原始字幕文本，以便重新分析）
    renderSidebar(words, settings, data.text);
    btn.textContent = uiText.done;

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 2000);
  } catch (error) {
    console.error("❌ 错误:", error);
    // 按钮始终使用英文
    const uiText = UI_TEXT.English;
    btn.textContent = uiText.failed;

    let errorMsg = error.message;
    if (errorMsg.includes("Failed to fetch")) {
      errorMsg =
        "无法连接到本地服务器。请确保 Python 服务器正在运行：\n\n./start_server.sh";
    }

    alert(`处理失败: ${errorMsg}`);

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 2000);
  }
}

// 调用 Gemini AI（根据用户设置调整 prompt）
async function callGeminiAI(text, settings) {
  // 从 Chrome Storage 获取用户的 API Key
  const apiKey = await new Promise((resolve) => {
    try {
      chrome.storage.sync.get(["geminiApiKey"], (result) => {
        if (chrome.runtime.lastError) {
          console.warn("⚠️ Chrome storage error:", chrome.runtime.lastError);
          resolve(null);
        } else {
          resolve(result.geminiApiKey);
        }
      });
    } catch (error) {
      console.warn("⚠️ Extension context error:", error);
      resolve(null);
    }
  });

  if (!apiKey) {
    throw new Error(
      "请先配置 API Key：点击浏览器工具栏的 WonderWords 图标，输入您的 Gemini API Key\n\n⚠️ 如果刚刚重新加载了扩展，请刷新此页面（F5）",
    );
  }

  const { difficulty, nativeLanguage } = settings;
  const targetLanguage = LANGUAGE_MAP[nativeLanguage] || "中文";

  const prompt = `You are an English teacher. The student is at ${difficulty} level (CEFR) and wants to learn NEW vocabulary from this video.

Extract ALL words/phrases that are AT OR ABOVE ${difficulty} level, because the student already knows vocabulary below ${difficulty}.

Include everything at ${difficulty}+ level:
1. Words and phrases at ${difficulty}, and all higher levels (B1→C2, B2→C2, C1→C2, etc.)
2. ALL phrasal verbs (e.g., "put someone up", "spring for", "get your hopes up")
3. ALL idioms and expressions (e.g., "back to square one", "chilling")
4. ALL cultural references and proper nouns (e.g., "Ascot", "tie or ascot")
5. ALL useful collocations and natural expressions

Level guide (extract AT OR ABOVE the student's level):
- Student is A1 → Extract A1, A2, B1, B2, C1, C2 (everything)
- Student is B1 → Extract B1, B2, C1, C2 (skip A1/A2 basics like "is", "the", "go")
- Student is C1 → Extract C1, C2 only (skip common words)

DO NOT limit quantity - this is for vocabulary building, extract ALL useful items (could be 5-30+ items).
Provide ALL definitions in ${targetLanguage} with clear explanations.

Return ONLY valid JSON array:
[{"word":"word/phrase", "definition":"${targetLanguage} explanation", "context":"exact original sentence"}]

Text: "${text.slice(0, 5000)}"`;

  // 尝试多个 Gemini 模型
  const models = [
    "gemini-flash-latest",
    "gemini-2.5-flash",
    "gemini-2.0-flash-exp",
  ];

  for (const model of models) {
    try {
      console.log(`🤖 尝试模型: ${model}`);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (!res.ok) {
        console.warn(`⚠️ 模型 ${model} 失败: ${res.status}`);
        continue;
      }

      const data = await res.json();
      const responseText = data.candidates[0].content.parts[0].text;
      const jsonStr = responseText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      console.log(`✅ 模型 ${model} 成功!`);
      return JSON.parse(jsonStr);
    } catch (error) {
      console.warn(`⚠️ 模型 ${model} 错误:`, error.message);
      continue;
    }
  }

  throw new Error("所有 AI 模型均失败，请检查 API Key 或网络");
}

function renderSidebar(data, settings, transcriptText = null) {
  const existing = document.getElementById("ww-sidebar");
  if (existing) existing.remove();

  const uiText = UI_TEXT[settings.nativeLanguage] || UI_TEXT.English;

  const div = document.createElement("div");
  div.id = "ww-sidebar";
  div.style.cssText =
    "position:fixed; top:0; right:0; width:350px; height:100vh; background:#111; color:#fff; padding:20px; z-index:9999; overflow-y:auto; border-left:1px solid #333; font-family: Arial, sans-serif;";

  // 标题和设置按钮
  div.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <h2 style="color:#3ea6ff; margin: 0;">WonderWords</h2>
      <button id="ww-settings-btn" style="background: none; border: none; color: #aaa; cursor: pointer; font-size: 20px;">⚙️</button>
    </div>
    <div style="color: #888; font-size: 12px; margin-bottom: 10px;">
      ${uiText.level}: ${settings.difficulty} | ${uiText.language}: ${LANGUAGE_MAP[settings.nativeLanguage]}
    </div>
    <hr style="border-color:#333">
    <div id="ww-content"></div>
    <div id="ww-settings-panel" style="display: none;"></div>
  `;

  // 词汇内容
  const contentDiv = div.querySelector("#ww-content");
  data.forEach((item) => {
    contentDiv.innerHTML += `
      <div style="background:#222; padding:12px; margin-bottom:12px; border-radius:8px; border-left: 3px solid #3ea6ff;">
        <div style="font-weight:bold; color:#fff; font-size:16px; margin-bottom: 5px;">${item.word}</div>
        <div style="color:#aaa; font-size:14px; margin-bottom: 8px;">${item.definition}</div>
        <div style="color:#666; font-size:12px; font-style: italic; line-height: 1.4;">"${item.context}"</div>
      </div>
    `;
  });

  // 设置面板
  const settingsPanel = div.querySelector("#ww-settings-panel");
  settingsPanel.innerHTML = `
    <h3 style="color:#3ea6ff; margin-top: 0;">Settings</h3>

    <div style="margin-bottom: 20px;">
      <label style="display: block; color: #aaa; font-size: 14px; margin-bottom: 8px;">Difficulty Level</label>
      <select id="ww-difficulty-select" style="width: 100%; padding: 8px; background: #222; color: #fff; border: 1px solid #444; border-radius: 5px; font-size: 14px;">
        ${Object.keys(DIFFICULTY_DESC)
          .map(
            (level) =>
              `<option value="${level}" ${settings.difficulty === level ? "selected" : ""}>${level} - ${DIFFICULTY_DESC[level]}</option>`,
          )
          .join("")}
      </select>
    </div>

    <div style="margin-bottom: 20px;">
      <label style="display: block; color: #aaa; font-size: 14px; margin-bottom: 8px;">Native Language</label>
      <select id="ww-language-select" style="width: 100%; padding: 8px; background: #222; color: #fff; border: 1px solid #444; border-radius: 5px; font-size: 14px;">
        ${Object.keys(LANGUAGE_MAP)
          .map(
            (lang) =>
              `<option value="${lang}" ${settings.nativeLanguage === lang ? "selected" : ""}>${LANGUAGE_MAP[lang]}</option>`,
          )
          .join("")}
      </select>
    </div>

    <button id="ww-save-settings" style="width: 100%; padding: 10px; background: #3ea6ff; color: #000; border: none; border-radius: 5px; font-weight: bold; cursor: pointer; margin-bottom: 10px;">
      Save Settings
    </button>

    <button id="ww-back-btn" style="width: 100%; padding: 10px; background: #333; color: #fff; border: none; border-radius: 5px; cursor: pointer;">
      Back to Results
    </button>
  `;

  // 关闭按钮
  const closeBtn = document.createElement("button");
  closeBtn.innerText = "✕ Close";
  closeBtn.style.cssText =
    "margin-top:20px; width:100%; padding:12px; background:#d32f2f; color:#fff; border:none; cursor:pointer; border-radius:5px; font-weight: bold;";
  closeBtn.onclick = () => div.remove();
  div.appendChild(closeBtn);

  document.body.appendChild(div);

  // 事件监听
  div.querySelector("#ww-settings-btn").onclick = () => {
    contentDiv.style.display = "none";
    settingsPanel.style.display = "block";
  };

  div.querySelector("#ww-back-btn").onclick = () => {
    contentDiv.style.display = "block";
    settingsPanel.style.display = "none";
  };

  div.querySelector("#ww-save-settings").onclick = async () => {
    const newSettings = {
      difficulty: div.querySelector("#ww-difficulty-select").value,
      nativeLanguage: div.querySelector("#ww-language-select").value,
    };

    await saveSettings(newSettings);

    // 如果有原始字幕文本，自动重新分析
    if (transcriptText) {
      try {
        const uiText = UI_TEXT[newSettings.nativeLanguage] || UI_TEXT.English;

        // 显示加载状态
        settingsPanel.innerHTML = `
          <div style="text-align: center; padding: 40px;">
            <div style="font-size: 40px; margin-bottom: 20px;">🤖</div>
            <div style="color: #aaa; font-size: 16px;">${uiText.reanalyzing}</div>
            <div style="color: #666; font-size: 14px; margin-top: 10px;">${uiText.level}: ${newSettings.difficulty} | ${uiText.language}: ${LANGUAGE_MAP[newSettings.nativeLanguage]}</div>
            <div style="color: #555; font-size: 12px; margin-top: 15px;">${uiText.waitingAPI}</div>
          </div>
        `;

        // 等待 3 秒，避免触发 API 速率限制
        await new Promise((resolve) => setTimeout(resolve, 3000));

        // 使用新设置重新分析
        const newWords = await callGeminiAI(transcriptText, newSettings);

        // 用新结果重新渲染侧边栏
        renderSidebar(newWords, newSettings, transcriptText);
      } catch (error) {
        alert(`重新分析失败: ${error.message}`);
        // 失败时回到设置面板
        contentDiv.style.display = "none";
        settingsPanel.style.display = "block";
      }
    } else {
      // 如果没有字幕文本，只更新显示
      const uiText = UI_TEXT[newSettings.nativeLanguage] || UI_TEXT.English;
      div.querySelector("div[style*='Level:']").innerHTML = `
        ${uiText.level}: ${newSettings.difficulty} | ${uiText.language}: ${LANGUAGE_MAP[newSettings.nativeLanguage]}
      `;
      alert("✅ Settings saved! Click 'Analyze Words' again to see changes.");
      contentDiv.style.display = "block";
      settingsPanel.style.display = "none";
    }
  };

  console.log("✅ 侧边栏显示成功");
}
