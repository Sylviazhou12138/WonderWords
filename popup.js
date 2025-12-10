document.addEventListener("DOMContentLoaded", () => {
  const apiKeyInput = document.getElementById("apiKey");
  const saveBtn = document.getElementById("saveBtn");
  const status = document.getElementById("status");

  // Load saved key
  chrome.storage.sync.get(["geminiApiKey"], (result) => {
    if (result.geminiApiKey) {
      apiKeyInput.value = result.geminiApiKey;
    }
  });

  // Save key
  saveBtn.addEventListener("click", () => {
    const key = apiKeyInput.value.trim();
    if (key) {
      chrome.storage.sync.set({ geminiApiKey: key }, () => {
        status.textContent = "API Key saved! Reload YouTube page.";
        setTimeout(() => (status.textContent = ""), 2000);
      });
    }
  });
});
