// Listen for messages from the popup or background script
// Monitor the page's DOM for changes
const blockedWordsChecker = async () => {
    const { blockedWords } = await chrome.storage.local.get("blockedWords");
    if (!blockedWords || blockedWords.length === 0) return;

    const bodyText = document.body.innerText;

    // Check for blocked words
    for (const word of blockedWords) {
        if (bodyText.includes(word)) {
            // Notify the background script to redirect
            chrome.runtime.sendMessage({ action: "block", reason: `Blocked word found: ${word}` });
            break;
        }
    }
};

// Set up a MutationObserver to monitor changes in the DOM
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        if (mutation.type === "childList" || mutation.type === "characterData") {
            blockedWordsChecker();
            break;
        }
    }
});

// Start observing the document body
observer.observe(document.body, { childList: true, subtree: true, characterData: true });

// Initial scan on page load
blockedWordsChecker();
