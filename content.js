// WonderWords - 完整版本 v4.0 (使用本地 Python API)
console.log("🚀 WonderWords v4.0 加载成功 - Python API 版");

let observer = null;

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
    btn.textContent = "📥 获取字幕...";
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

    btn.textContent = "🤖 AI 分析中...";

    // 调用 AI 分析
    const words = await callGeminiAI(data.text);

    if (!words || words.length === 0) {
      throw new Error("AI 未返回结果");
    }

    // 显示侧边栏
    renderSidebar(words);
    btn.textContent = "✅ 完成!";

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 2000);
  } catch (error) {
    console.error("❌ 错误:", error);
    btn.textContent = "❌ 失败";

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

// 调用 Gemini AI
async function callGeminiAI(text) {
  const apiKey = "AIzaSyAYN7e9oTmOEg_gjRarPrscJvpYXZFCjlc";

  const prompt = `You are an English teacher. Extract 5-8 advanced words or idioms (B2+ level) from the following text. Return ONLY a valid JSON array:
[{"word":"phrase", "definition":"中文释义", "context":"original sentence"}]

Text: "${text.slice(0, 5000)}"`;

  // 尝试多个 Gemini 模型（使用 v1beta API 和正确的模型名称）
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
        continue; // 尝试下一个模型
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

  // 所有模型都失败
  throw new Error("所有 AI 模型均失败，请检查 API Key 或网络");
}

function renderSidebar(data) {
  const existing = document.getElementById("ww-sidebar");
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.id = "ww-sidebar";
  div.style.cssText =
    "position:fixed; top:0; right:0; width:300px; height:100vh; background:#111; color:#fff; padding:20px; z-index:9999; overflow-y:auto; border-left:1px solid #333;";

  div.innerHTML = `<h2 style="color:#3ea6ff">WonderWords</h2><hr style="border-color:#333">`;

  data.forEach((item) => {
    div.innerHTML += `
      <div style="background:#222; padding:10px; margin-bottom:10px; border-radius:5px;">
        <div style="font-weight:bold; color:#fff; font-size:16px;">${item.word}</div>
        <div style="color:#aaa; font-size:14px;">${item.definition}</div>
        <div style="color:#3ea6ff; font-size:12px; margin-top:5px;">"${item.context}"</div>
      </div>
    `;
  });

  const close = document.createElement("button");
  close.innerText = "Close";
  close.style.cssText =
    "margin-top:20px; width:100%; padding:10px; background:#333; color:#fff; border:none; cursor:pointer; border-radius:5px;";
  close.onclick = () => div.remove();
  div.appendChild(close);

  document.body.appendChild(div);
  console.log("✅ 侧边栏显示成功");
}
