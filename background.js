// background.js - 增强版字幕抓取器

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "FETCH_SUBTITLES") {
    // 策略1: 直接获取字幕 URL
    fetch(request.url, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.9",
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((data) => {
        if (data.length < 50) {
          console.warn("⚠️ 字幕数据异常短:", data.length);
        }
        sendResponse({ success: true, data: data });
      })
      .catch((error) => {
        console.error("❌ 字幕获取失败:", error);
        sendResponse({ success: false, error: error.toString() });
      });
    return true;
  }

  if (request.type === "FETCH_TRANSCRIPT") {
    // 策略2: 通过 innertube API 获取
    const videoId = request.videoId;
    console.log("🔄 Background: 获取视频", videoId, "的字幕");

    fetch(`https://www.youtube.com/watch?v=${videoId}`)
      .then((res) => {
        console.log("📥 获取页面成功，状态:", res.status);
        return res.text();
      })
      .then((html) => {
        console.log("📄 HTML 长度:", html.length);

        // 尝试多种匹配模式
        let match = html.match(/"captionTracks":(\[.+?\])/);

        if (!match) {
          console.warn("⚠️ 未找到 captionTracks，尝试备用模式");
          match = html.match(
            /"captions":\{"playerCaptionsTracklistRenderer":\{"captionTracks":(\[.+?\])/,
          );
        }

        if (match) {
          console.log("✅ 找到字幕轨道数据");
          const tracks = JSON.parse(match[1]);
          console.log("📋 可用字幕数量:", tracks.length);

          const engTrack =
            tracks.find((t) => t.languageCode === "en") || tracks[0];
          console.log("🎯 选择字幕:", engTrack.name?.simpleText || "未知");

          return fetch(engTrack.baseUrl);
        }
        throw new Error("未找到字幕轨道");
      })
      .then((res) => {
        console.log("📥 获取字幕文件成功");
        return res.text();
      })
      .then((xml) => {
        console.log("📦 原始字幕 XML 长度:", xml.length);
        const text = xml
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        console.log("✅ 解析后文本长度:", text.length);
        sendResponse({ success: true, text: text });
      })
      .catch((error) => {
        console.error("❌ Transcript 获取失败:", error);
        sendResponse({ success: false, error: error.toString() });
      });
    return true;
  }
});
