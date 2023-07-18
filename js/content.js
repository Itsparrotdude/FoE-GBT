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

// content.js

// Function to create an overlay div
function createOverlay() {
  const overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.zIndex = '9999'; // A higher value to appear on top of the canvas
  overlay.style.pointerEvents = 'none'; // Allow mouse events to pass through

  document.body.appendChild(overlay);
  return overlay;
}


// Function to insert the loaded HTML content into the DOM
function insertHtmlIntoPage(htmlContent) {
  // ... (your existing code for insertHtmlIntoPage)

  // Create the overlay
  const overlay = createOverlay();

  // Create the image element
  const imageElement = document.createElement("img");
  // Directly use the image URL (since it's web_accessible_resource)
  imageElement.src = chrome.runtime.getURL("images/leroy.png");
  // Position the image on the canvas (adjust top and left as needed)
  imageElement.style.position = 'absolute';
  imageElement.style.top = '50px';
  imageElement.style.left = '50px';

  // Append the image to the overlay
  overlay.appendChild(imageElement);
}


// Function to insert the loaded HTML content into the DOM
function insertHtmlIntoPage(htmlContent) {
  // ... (your existing code for insertHtmlIntoPage)

  // Create the overlay
  const overlay = createOverlay();

  // Create the image element
  const imageElement = document.createElement("img");
  // Directly use the image URL (since it's web_accessible_resource)
  imageElement.src = chrome.runtime.getURL("images/leroy.png");
  // Position the image on the canvas (adjust top and left as needed)
  imageElement.style.position = 'absolute';
  imageElement.style.top = '50px';
  imageElement.style.left = '50px';

  // Append the image to the overlay
  overlay.appendChild(imageElement);

  // Adjust overlay position if the game uses iframes
  const gameIframe = document.querySelector("iframe"); // Update this selector based on the actual iframe element used by the game
  if (gameIframe) {
    const iframeRect = gameIframe.getBoundingClientRect();
    overlay.style.top = iframeRect.top + 'px';
    overlay.style.left = iframeRect.left + 'px';
  }
}