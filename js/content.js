// content.js

// Function to check if the extension is properly injected
function checkInjection() {
  if (document.documentElement.hasAttribute("data-foe-helper-injected")) {
    console.log("Forge of Empires Helper Extension has been successfully injected!");
  } else {
    console.error("Forge of Empires Helper Extension failed to inject properly.");
  }
}

// Call the checkInjection function when the document is ready
document.addEventListener("DOMContentLoaded", checkInjection);

chrome.extension.getURL('leroy.png')


