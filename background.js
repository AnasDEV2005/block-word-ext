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

chrome.runtime.onMessage.addListener((message, sender) => {
    // Skip URLs that start with chrome://, about:, or data:
    if (sender.url.startsWith("chrome://") || sender.url.startsWith("about:") || sender.url.startsWith("data:")) {
        return;
    }

    chrome.storage.local.get("blockedWords", ({ blockedWords }) => {
        // If there are blocked words in storage
        if (blockedWords) {
            // Use an async function to wait for the page content to be fetched
            const fetchAndCheckPage = async () => {
                try {
                    // Fetch the page content asynchronously
                    const response = await fetch(sender.url);
                    const pageContent = await response.text();

                    // Check if any blocked word is found in the page content
                    for (const word of blockedWords) {
                        if (pageContent.includes(word)) {
                            console.log("Blocked word found, redirecting...");
                            // Update the tab's URL if a blocked word is found
                            chrome.tabs.update(sender.tab.id, {
                                url: "https://rusting-server-921y.onrender.com/"
                            });
                            break; // Exit loop after blocking the page
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch page content:", error);
                }
            };

            // Call the function to fetch and check the page content
            fetchAndCheckPage();
        }
    });
});

