document.addEventListener("DOMContentLoaded", () => {
  const difficultySelect = document.getElementById("difficulty");
  const languageSelect = document.getElementById("language");
  const saveBtn = document.getElementById("saveBtn");
  const status = document.getElementById("status");

  // Load saved settings
  chrome.storage.sync.get(
    { difficulty: "B2", nativeLanguage: "Chinese" },
    (result) => {
      difficultySelect.value = result.difficulty;
      languageSelect.value = result.nativeLanguage;
    },
  );

  // Save settings
  saveBtn.addEventListener("click", () => {
    chrome.storage.sync.set(
      {
        difficulty: difficultySelect.value,
        nativeLanguage: languageSelect.value,
      },
      () => {
        status.textContent = "Saved! Reload YouTube page to apply.";
        setTimeout(() => (status.textContent = ""), 3000);
      },
    );
  });
});
