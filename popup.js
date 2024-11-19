const wordInput = document.getElementById("word");
const addWordButton = document.getElementById("addWord");
const wordList = document.getElementById("wordList");

let masterPassword = ""; // Store the master password
 
// Add a new blocked word
addWordButton.addEventListener("click", async () => {
    const word = wordInput.value.trim();
    if (word) {
        // Prompt to set the master password if not already set
        if (!masterPassword) {
            masterPassword = prompt("Set a master password to lock/unlock words:");
            if (!masterPassword) {
                alert("Password is required to continue.");
                return;
            }
            alert("Password set! Use this password to lock/unlock words.");
        }

        addBlockedWord(word, false); // Initially unlocked
        wordInput.value = ""; // Clear input
    }
});

// Load blocked words from storage
chrome.storage.local.get("blockedWords", ({ blockedWords }) => {
    if (Array.isArray(blockedWords)) {
        blockedWords.forEach(word => addBlockedWord(word)); // Add each word
    }
});

// Add a word to the list with a remove button
function addBlockedWord(word) {
    const li = document.createElement("li");
    const removeButton = document.createElement("button");

    li.textContent = word + " ";
    removeButton.textContent = "Remove";

    // Handle removing the word
    removeButton.addEventListener("click", () => {
        const enteredPassword = prompt("Enter password to remove this word:");
        if (enteredPassword === masterPassword) {
            if (confirm(`Are you sure you want to remove "${word}"?`)) {
                li.remove(); // Remove the word from the list visually
                removeBlockedWord(word); // Update storage
            }
        } else {
            alert("Incorrect password!");
        }
    });

    li.appendChild(removeButton);
    wordList.appendChild(li);

    // Save the blocked word to storage
    saveBlockedWord(word); // This ensures that the word is stored in chrome.storage.local
}




// Save a new blocked word to storage
function saveBlockedWord(word) {
    chrome.storage.local.get("blockedWords", ({ blockedWords }) => {
        blockedWords = blockedWords || [];
        word = word.trim().toLowerCase(); // Ensure clean, lowercase input
        if (!blockedWords.includes(word)) {
            blockedWords.push(word);
            chrome.storage.local.set({ blockedWords });
        }
    });
}

// Remove a word from storage
function removeBlockedWord(word) {
    chrome.storage.local.get("blockedWords", ({ blockedWords }) => {
        blockedWords = blockedWords.filter((entry) => entry !== word);
        chrome.storage.local.set({ blockedWords });
    });
}
