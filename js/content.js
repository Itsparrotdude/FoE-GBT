// content.js

// Function to check if the extension is properly injected
function checkInjection() {
  // ... (your existing code for checkInjection)
}

// Function to insert the loaded HTML content into the DOM
function insertHtmlIntoPage(htmlContent) {
  // ... (your existing code for insertHtmlIntoPage)

  // Create the image element
  const imageElement = document.createElement("img");
  
  // Send a message to the background script to get the image URL
  chrome.runtime.sendMessage({ type: "getImageUrl" }, (response) => {
    if (response && response.imageUrl) {
      imageElement.src = response.imageUrl;
      // Append the image to the document body or any other element you desire
      document.body.appendChild(imageElement);
    }
  });
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
