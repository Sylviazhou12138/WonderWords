// WonderWords - v1.5 (时间戳匹配优化 + JSON修复简化 + Debug日志)
console.log("🚀 WonderWords v1.5 加载成功");

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

// 注入全局样式
function injectStyles() {
  if (document.getElementById("ww-styles")) return;
  const style = document.createElement("style");
  style.id = "ww-styles";
  style.textContent = `
    .ww-card:hover { background: #2a2a2a !important; }
    .ww-context:hover { background: #1a1a3e !important; }
    #ww-export-csv:hover, #ww-export-json:hover { background: #333 !important; }
    .ww-copy-btn:hover { color: #fff !important; }
    .ww-caption-word { color: #3ea6ff; text-decoration: underline; cursor: pointer; position: relative; }
    .ww-caption-tooltip {
      position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
      background: #111; color: #fff; padding: 10px 14px; border-radius: 8px;
      border: 1px solid #3ea6ff55; font-size: 13px; line-height: 1.5;
      white-space: normal; width: 280px; z-index: 99999;
      pointer-events: none; box-shadow: 0 4px 20px rgba(0,0,0,0.6);
    }
    .ww-caption-tooltip .ww-tt-word { color: #3ea6ff; font-weight: bold; font-size: 14px; margin-bottom: 4px; }
    .ww-caption-tooltip .ww-tt-def { color: #aaa; font-size: 12px; margin-bottom: 4px; }
    .ww-caption-tooltip .ww-tt-mic { color: #ccc; font-size: 12px; border-left: 2px solid #555; padding-left: 6px; }
  `;
  document.head.appendChild(style);
}
injectStyles();

// 将字幕 entries 转为带时间戳的文本，供 AI 分析
function buildTimestampedText(entries) {
  if (!entries || entries.length === 0) return "";
  return entries
    .map((e) => {
      const secs = Math.floor(e.start);
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      const ts = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      return `[${ts}] ${e.text}`;
    })
    .join("\n");
}

// 格式化秒数为 m:ss 显示
function formatTimestamp(seconds) {
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// 跳转到视频指定时间
function jumpToTimestamp(seconds) {
  const video = document.querySelector("video");
  if (video) {
    video.currentTime = seconds;
    video.play();
  }
}

// 导出为 CSV (Anki 格式，Tab 分隔)
function exportCSV(data) {
  const videoId =
    new URLSearchParams(window.location.search).get("v") || "unknown";
  const header = "word\tdefinition\tmeaning_in_context\tcontext_sentence";
  const rows = data.map((item) => {
    const word = (item.word || "").replace(/\t/g, " ");
    const def = (item.definition || "").replace(/\t/g, " ");
    const mic = (item.meaning_in_context || "").replace(/\t/g, " ");
    const ctx = (item.context_sentence || item.context || "").replace(
      /\t/g,
      " ",
    );
    return `${word}\t${def}\t${mic}\t${ctx}`;
  });
  const csv = [header, ...rows].join("\n");
  downloadFile(csv, `wonderwords_${videoId}.csv`, "text/csv;charset=utf-8");
}

// 导出为 JSON
function exportJSON(data) {
  const videoId =
    new URLSearchParams(window.location.search).get("v") || "unknown";
  const json = JSON.stringify(data, null, 2);
  downloadFile(
    json,
    `wonderwords_${videoId}.json`,
    "application/json;charset=utf-8",
  );
}

// 通用下载函数
function downloadFile(content, filename, mimeType) {
  const blob = new Blob(["\uFEFF" + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 复制到剪贴板
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    console.log("📋 已复制到剪贴板");
  });
}

// 根据 context_sentence / word / aiTimestamp 在 entries 中匹配精确的 start 时间
function matchEntryTimestamp(contextSentence, entries, word, aiTimestamp) {
  if (!entries || entries.length === 0) return null;
  const ctx = (contextSentence || "").toLowerCase().trim();
  const w = (word || "").toLowerCase().trim();

  // 第一层：精确匹配 context_sentence
  if (ctx) {
    for (const e of entries) {
      if (e.text.toLowerCase().trim() === ctx) return e.start;
    }
    // 第 1.5 层：context_sentence 包含在 entry 中，或 entry 包含在 context_sentence 中
    for (const e of entries) {
      const t = e.text.toLowerCase().trim();
      if (t && ctx && (t.includes(ctx) || ctx.includes(t))) {
        return e.start;
      }
    }
  }

  // 第二层：用 word 关键词在 entries 中找，多个匹配取离 aiTimestamp 最近的
  if (w) {
    const wordMatches = entries.filter((e) => {
      const t = e.text.toLowerCase();
      // 用单词边界匹配，避免 "art" 匹配到 "start"
      const re = new RegExp(
        "\\b" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b",
        "i",
      );
      return re.test(t);
    });
    if (wordMatches.length === 1) return wordMatches[0].start;
    if (wordMatches.length > 1 && aiTimestamp != null) {
      // 选离 AI 给的时间戳最近的
      let best = wordMatches[0];
      for (const m of wordMatches) {
        if (
          Math.abs(m.start - aiTimestamp) < Math.abs(best.start - aiTimestamp)
        ) {
          best = m;
        }
      }
      return best.start;
    }
    if (wordMatches.length > 1) return wordMatches[0].start;
  }

  // 第三层：子串匹配（要求长度 > 10 避免短文本误匹配）
  if (ctx.length > 10) {
    const substringMatches = [];
    for (const e of entries) {
      const t = e.text.toLowerCase().trim();
      if (t.length > 10 && (ctx.includes(t) || t.includes(ctx))) {
        substringMatches.push(e);
      }
    }
    if (substringMatches.length === 1) return substringMatches[0].start;
    if (substringMatches.length > 1 && aiTimestamp != null) {
      let best = substringMatches[0];
      for (const m of substringMatches) {
        if (
          Math.abs(m.start - aiTimestamp) < Math.abs(best.start - aiTimestamp)
        ) {
          best = m;
        }
      }
      return best.start;
    }
    if (substringMatches.length > 0) return substringMatches[0].start;
  }

  // 第四层：用 AI 给的 timestamp 找最近的 entry（兜底）
  if (aiTimestamp != null) {
    let best = entries[0];
    for (const e of entries) {
      if (
        Math.abs(e.start - aiTimestamp) < Math.abs(best.start - aiTimestamp)
      ) {
        best = e;
      }
    }
    return best.start;
  }

  return null;
}

// 在原句中高亮目标词汇
function highlightWord(sentence, word) {
  if (!sentence || !word) return sentence || "";
  // 转义正则特殊字符
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  return sentence.replace(
    regex,
    '<span style="background:#3ea6ff33; color:#3ea6ff; font-weight:bold; padding:1px 3px; border-radius:3px;">$1</span>',
  );
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
    const response = await fetch(`http://localhost:5001/transcript/${videoId}`);
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "获取字幕失败");
    }

    console.log("📝 字幕长度:", data.length);

    btn.textContent = uiText.analyzing;

    console.log("⚙️ 当前设置:", settings);

    // 构建带时间戳的字幕文本供 AI 分析
    const entries = data.entries || [];
    const timestampedText = buildTimestampedText(entries);

    console.log("📋 带时间戳字幕长度:", timestampedText.length);

    // 调用 AI 分析
    const words = await callGeminiAI(timestampedText || data.text, settings);

    if (!words || words.length === 0) {
      throw new Error("AI 未返回结果");
    }

    console.log("🤖 AI 返回结果:", words.length, "个词汇");

    // 用 entries 精确匹配时间戳
    const correctedWords = words.map((item) => {
      const matched = matchEntryTimestamp(
        item.context_sentence || item.context || "",
        entries,
        item.word || "",
        item.timestamp,
      );
      if (matched != null) {
        item.timestamp = matched;
      }
      return item;
    });

    // 显示侧边栏
    renderSidebar(
      correctedWords,
      settings,
      timestampedText || data.text,
      entries,
    );
    initCaptionOverlay(correctedWords);

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
  const apiKey = "AIzaSyDYnikemmxxPzvFeA_6u79QV45IwPnbl1c";

  const { difficulty, nativeLanguage } = settings;
  const targetLanguage = LANGUAGE_MAP[nativeLanguage] || "中文";

  const prompt = `Extract vocabulary from YouTube subtitles for an English learner.

Find 30-50 useful words/phrases: interesting vocabulary, phrasal verbs, idioms, collocations, slang expressions.

For EACH item return JSON:
{"word":"...", "timestamp":秒数, "context_sentence":"完整原句", "definition":"${targetLanguage}释义", "meaning_in_context":"${targetLanguage}语境说明"}

Rules:
- timestamp: convert [MM:SS] to seconds (e.g., [01:23] = 83)
- context_sentence: copy EXACT subtitle line
- meaning_in_context: explain the tone/emotion/usage in this context (10-15 words)

Return ONLY a JSON array, no other text.

${text.slice(0, 15000)}`;

  // 尝试多个 Gemini 模型，429 时自动重试
  const models = ["gemini-2.0-flash-lite", "gemini-2.0-flash"];

  for (const model of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        console.log(
          `🤖 尝试模型: ${model}` + (attempt > 0 ? ` (重试 ${attempt})` : ""),
        );
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              maxOutputTokens: 8192,
            },
          }),
        });

        if (res.status === 429) {
          const wait = (attempt + 1) * 5;
          console.warn(`⚠️ 模型 ${model} 限流 (429)，${wait}s 后重试...`);
          await new Promise((r) => setTimeout(r, wait * 1000));
          continue;
        }

        if (!res.ok) {
          console.warn(`⚠️ 模型 ${model} 失败: ${res.status}`);
          break;
        }

        const data = await res.json();
        const responseText = data.candidates[0].content.parts[0].text;
        console.log(`📝 AI 原始响应长度: ${responseText.length} 字符`);
        console.log(`📝 AI 响应前500字符:`, responseText.slice(0, 500));
        let jsonStr = responseText
          .replace(/```json\n?/g, "")
          .replace(/```\n?/g, "")
          .trim();

        // 尝试解析 JSON
        try {
          const result = JSON.parse(jsonStr);
          console.log(`✅ 模型 ${model} 成功! 解析到 ${result.length} 个词汇`);
          return result;
        } catch (parseError) {
          console.warn(`⚠️ JSON 解析失败，尝试逐个提取对象...`);

          // 用正则逐个提取完整的 JSON 对象
          const objects = [];
          // 匹配 {"word": ... } 格式的完整对象
          const objRegex =
            /\{\s*"word"\s*:\s*"[^"]*"[^{}]*(?:"[^"]*"[^{}]*)*\}/g;
          let match;
          while ((match = objRegex.exec(jsonStr)) !== null) {
            try {
              const obj = JSON.parse(match[0]);
              if (obj.word) {
                objects.push(obj);
              }
            } catch (e) {
              // 跳过无法解析的对象
            }
          }

          if (objects.length > 0) {
            console.log(`✅ 提取成功，恢复了 ${objects.length} 个词汇`);
            return objects;
          }

          console.error(`❌ 无法提取任何词汇`);
          throw parseError;
        }
      } catch (error) {
        console.warn(`⚠️ 模型 ${model} 错误:`, error.message);
        break;
      }
    }
  }

  throw new Error("所有 AI 模型均失败，请稍后重试");
}

function renderSidebar(
  data,
  settings,
  transcriptText = null,
  entries = null,
  isPartial = false,
) {
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
      <span style="float:right;">${data.length} words${isPartial ? " ⏳" : ""}</span>
    </div>
    ${isPartial ? '<div style="background:#2a2a3a; color:#8ab4f8; padding:8px 12px; border-radius:6px; margin-bottom:10px; font-size:12px;">⏳ 加载更多词汇中...</div>' : ""}
    <hr style="border-color:#333">
    <div id="ww-content"></div>
    <div id="ww-settings-panel" style="display: none;"></div>
  `;

  // 词汇内容
  const contentDiv = div.querySelector("#ww-content");
  data.forEach((item) => {
    const ts = item.timestamp != null ? item.timestamp : null;
    const tsLabel = ts != null ? formatTimestamp(ts) : "";
    const contextSentence = item.context_sentence || item.context || "";
    const definition = item.definition || "";
    const meaningInContext = item.meaning_in_context || "";
    const highlightedContext = highlightWord(contextSentence, item.word);

    const card = document.createElement("div");
    card.className = "ww-card";
    card.style.cssText =
      "background:#222; padding:12px; margin-bottom:12px; border-radius:8px; border-left: 3px solid #3ea6ff; transition: background 0.2s;";

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
        <div style="font-weight:bold; color:#fff; font-size:16px;">${item.word}</div>
        <div style="display:flex; gap:5px; align-items:center;">
          <button class="ww-copy-btn" data-word="${item.word}" data-def="${definition}" style="background:none; border:none; color:#666; cursor:pointer; font-size:14px; padding:2px 5px;" title="Copy">📋</button>
          ${
            ts != null
              ? `<button class="ww-play-btn" data-timestamp="${ts}" style="background:#3ea6ff22; border:1px solid #3ea6ff55; color:#3ea6ff; padding:3px 10px; border-radius:12px; cursor:pointer; font-size:12px; white-space:nowrap;">▶ ${tsLabel}</button>`
              : ""
          }
        </div>
      </div>
      ${definition ? `<div style="color:#aaa; font-size:13px; margin-bottom:4px;">${definition}</div>` : ""}
      ${meaningInContext ? `<div style="color:#ccc; font-size:13px; margin-bottom:8px; line-height:1.5; border-left:2px solid #555; padding-left:8px;">${meaningInContext}</div>` : ""}
      <div class="ww-context" ${ts != null ? `data-timestamp="${ts}"` : ""} style="background:#1a1a2e; padding:8px 10px; border-radius:5px; font-size:12px; color:#aaa; line-height:1.5; font-style:italic; ${ts != null ? "cursor:pointer;" : ""}">${highlightedContext}</div>
    `;

    contentDiv.appendChild(card);
  });

  // 事件委托：Play 按钮、复制按钮、例句点击
  contentDiv.addEventListener("click", (e) => {
    // Play 按钮
    const playBtn = e.target.closest(".ww-play-btn");
    if (playBtn) {
      const ts = parseFloat(playBtn.dataset.timestamp);
      if (!isNaN(ts)) jumpToTimestamp(ts);
      return;
    }
    // 复制按钮
    const copyBtn = e.target.closest(".ww-copy-btn");
    if (copyBtn) {
      const word = copyBtn.dataset.word || "";
      const def = copyBtn.dataset.def || "";
      copyToClipboard(`${word} - ${def}`);
      copyBtn.textContent = "✅";
      setTimeout(() => {
        copyBtn.textContent = "📋";
      }, 1500);
      return;
    }
    // 例句点击跳转
    const ctx = e.target.closest(".ww-context");
    if (ctx && ctx.dataset.timestamp) {
      const ts = parseFloat(ctx.dataset.timestamp);
      if (!isNaN(ts)) jumpToTimestamp(ts);
    }
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

  // 导出按钮区域
  const exportDiv = document.createElement("div");
  exportDiv.style.cssText = "margin-top:15px; display:flex; gap:8px;";
  exportDiv.innerHTML = `
    <button id="ww-export-csv" style="flex:1; padding:10px; background:#2a2a2a; color:#3ea6ff; border:1px solid #3ea6ff55; border-radius:5px; cursor:pointer; font-size:13px; font-weight:bold;">📥 CSV (Anki)</button>
    <button id="ww-export-json" style="flex:1; padding:10px; background:#2a2a2a; color:#3ea6ff; border:1px solid #3ea6ff55; border-radius:5px; cursor:pointer; font-size:13px; font-weight:bold;">📥 JSON</button>
  `;
  div.appendChild(exportDiv);

  // 关闭按钮
  const closeBtn = document.createElement("button");
  closeBtn.innerText = "✕ Close";
  closeBtn.style.cssText =
    "margin-top:10px; width:100%; padding:12px; background:#d32f2f; color:#fff; border:none; cursor:pointer; border-radius:5px; font-weight: bold;";
  closeBtn.onclick = () => div.remove();
  div.appendChild(closeBtn);

  document.body.appendChild(div);

  // 导出按钮事件
  div.querySelector("#ww-export-csv").onclick = () => exportCSV(data);
  div.querySelector("#ww-export-json").onclick = () => exportJSON(data);

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

        // 短暂等待，避免触发 API 速率限制
        await new Promise((resolve) => setTimeout(resolve, 500));

        // 使用新设置重新分析
        const newWords = await callGeminiAI(transcriptText, newSettings);

        // 用 entries 精确匹配时间戳
        if (entries) {
          newWords.forEach((item) => {
            const matched = matchEntryTimestamp(
              item.context_sentence || item.context || "",
              entries,
              item.word || "",
              item.timestamp,
            );
            if (matched != null) item.timestamp = matched;
          });
        }

        // 用新结果重新渲染侧边栏
        renderSidebar(newWords, newSettings, transcriptText, entries);
        initCaptionOverlay(newWords);
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

// ======= 字幕悬停功能 (Caption Overlay) =======

let captionObserver = null;
let activeWords = []; // 当前分析结果的词汇列表

// 初始化字幕悬停
function initCaptionOverlay(words) {
  stopCaptionOverlay();
  if (!words || words.length === 0) return;

  // 构建词汇查找表（小写 → 原始数据）
  activeWords = words.map((w) => ({
    ...w,
    _lower: (w.word || "").toLowerCase(),
    _tokens: (w.word || "").toLowerCase().split(/\s+/),
  }));

  // 监听字幕容器变化
  captionObserver = new MutationObserver(() => processCaptions());
  const player = document.querySelector(".html5-video-player");
  if (player) {
    captionObserver.observe(player, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    console.log("✅ 字幕悬停已激活");
  }
}

// 停止字幕悬停
function stopCaptionOverlay() {
  if (captionObserver) {
    captionObserver.disconnect();
    captionObserver = null;
  }
  activeWords = [];
}

// 处理字幕 DOM
function processCaptions() {
  const segments = document.querySelectorAll(".ytp-caption-segment");
  segments.forEach((seg) => {
    if (seg.dataset.wwProcessed) return;
    seg.dataset.wwProcessed = "1";

    const text = seg.textContent || "";
    const result = highlightCaptionWords(text);
    if (result !== text) {
      seg.innerHTML = result;
      seg.style.position = "relative";
      seg.style.overflow = "visible";

      // 悬停事件
      seg.addEventListener("mouseenter", handleCaptionHover, true);
      seg.addEventListener("mouseleave", handleCaptionLeave, true);
    }
  });
}

// 在字幕文本中高亮匹配的词汇
function highlightCaptionWords(text) {
  if (!activeWords.length) return text;

  // 先匹配多词短语（长的优先），再匹配单词
  const sorted = [...activeWords].sort(
    (a, b) => b._lower.length - a._lower.length,
  );
  let result = text;

  for (const w of sorted) {
    const escaped = w._lower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b(${escaped})\\b`, "gi");
    result = result.replace(re, (match) => {
      return `<span class="ww-caption-word" data-ww-word="${w._lower}">${match}</span>`;
    });
  }
  return result;
}

// 字幕词汇悬停 — 显示提示
function handleCaptionHover(e) {
  const target = e.target.closest(".ww-caption-word");
  if (!target) return;

  // 移除已有提示
  document.querySelectorAll(".ww-caption-tooltip").forEach((t) => t.remove());

  const wordKey = (target.dataset.wwWord || "").toLowerCase();
  const wordData = activeWords.find((w) => w._lower === wordKey);
  if (!wordData) return;

  const tooltip = document.createElement("div");
  tooltip.className = "ww-caption-tooltip";
  tooltip.innerHTML = `
    <div class="ww-tt-word">${wordData.word}</div>
    <div class="ww-tt-def">${wordData.definition || ""}</div>
    ${wordData.meaning_in_context ? `<div class="ww-tt-mic">${wordData.meaning_in_context}</div>` : ""}
  `;
  target.appendChild(tooltip);
}

// 字幕词汇离开 — 隐藏提示
function handleCaptionLeave(e) {
  const target = e.target.closest(".ww-caption-word");
  if (!target) return;
  const tooltip = target.querySelector(".ww-caption-tooltip");
  if (tooltip) tooltip.remove();
}
