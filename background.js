// Clear blocked words when the extension is installed or reloaded
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.clear(() => {
        console.log("Blocked words have been cleared from storage.");
    });
});

chrome.webNavigation.onCompleted.addListener(async (details) => {
    // Skip unsupported URL schemes
    if (details.url.startsWith("chrome://") || details.url.startsWith("about:") || details.url.startsWith("data:")) {
        return;
    }

    const { blockedWords } = await chrome.storage.local.get("blockedWords");
    if (blockedWords) {
        try {
            const pageContent = await fetch(details.url).then((res) => res.text());
            for (const word of blockedWords) {
                if (pageContent.includes(word)) {
                    console.log("block should have happenned");
                    chrome.tabs.update(details.tabId, {
                        url: "https://rusting-server-921y.onrender.com/"
                    });
                    break;
                }
            }
        } catch (error) {
            console.error("Failed to fetch page content:", error);
        }
    }
}, { url: [{ urlMatches: ".*" }] });

chrome.runtime.onMessage.addListener(async (message, sender) => {
    if (details.url.startsWith("chrome://") || details.url.startsWith("about:") || details.url.startsWith("data:")) {
        return;
    }

    const { blockedWords } = await chrome.storage.local.get("blockedWords");
    if (blockedWords) {
        try {
            const pageContent = await fetch(details.url).then((res) => res.text());
            for (const word of blockedWords) {
                if (pageContent.includes(word)) {
                    console.log("block should have happenned");
                    chrome.tabs.update(details.tabId, {
                        url: "https://rusting-server-921y.onrender.com/"
                    });
                    break;
                }
            }
        } catch (error) {
            console.error("Failed to fetch page content:", error);
        }
    }
});
