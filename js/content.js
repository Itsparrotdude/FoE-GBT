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


// Function to load HTML file using Fetch API
async function loadHtmlFile(fileUrl) {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Error loading HTML file: ${response.statusText}`);
    }
    const htmlContent = await response.text();
    return htmlContent;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Function to insert the loaded HTML content into the DOM
function insertHtmlIntoPage(htmlContent) {
  if (!htmlContent) {
    return;
  }
  
  // Create a new div element to hold the loaded HTML content
  const div = document.createElement('div');
  div.innerHTML = htmlContent;
  
  // Append the content to the document body or any other element you desire
  document.body.appendChild(div);
}

// Usage: Load and insert the blue_box.html content into the page
const htmlFileUrl = chrome.runtime.getURL('html/popup2.html');
loadHtmlFile(htmlFileUrl)
  .then((htmlContent) => {
    insertHtmlIntoPage(htmlContent);
  })
  .catch((error) => {
    console.error(error);
  });
