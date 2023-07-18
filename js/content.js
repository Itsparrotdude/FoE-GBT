// content.js

// Function to check if the extension is properly injected
function checkInjection() {
  // ... (your existing code for checkInjection)
}

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
  // ... (your existing code for insertHtmlIntoPage)

  // Create the image element
  const imageElement = document.createElement("img");
  // Directly use the image URL (since it's web_accessible_resource)
  imageElement.src = chrome.runtime.getURL("images/leroy.png");

  // Append the image to the document body or any other element you desire
  document.body.appendChild(imageElement);
}

// Call the checkInjection function when the document is ready
document.addEventListener("DOMContentLoaded", () => {
  checkInjection();

  // Usage: Load and insert the html/popup2.html content into the page
  const htmlFileUrl = chrome.runtime.getURL('html/popup2.html');
  loadHtmlFile(htmlFileUrl)
    .then((htmlContent) => {
      insertHtmlIntoPage(htmlContent);
    })
    .catch((error) => {
      console.error(error);
    });
});
