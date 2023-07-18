// // Function to check if the extension is properly injected
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

// Function to create an overlay div
function createOverlay() {
  const overlay = document.createElement("div");
  overlay.style.position = "absolute";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.zIndex = "9999"; // A higher value to appear on top of the canvas
  // overlay.style.pointerEvents = 'none'; // Allow mouse events to pass through

  document.body.appendChild(overlay);
  return overlay;
  
}

// Function to insert the loaded HTML content into the DOM
function insertHtmlIntoPage(htmlContent) {
  // ... (your existing code for insertHtmlIntoPage)

  // // Create the overlay
  // const overlay = createOverlay();

  // Create the image element
  const imageElement = document.createElement("img");
  // Directly use the image URL (since it's web_accessible_resource)
  imageElement.src = chrome.runtime.getURL("images/leroy.png");
  // Position the image on the canvas (adjust top and left as needed)
  imageElement.style.position = "fixed";
  imageElement.style.bottom = "0px";
  imageElement.style.right = "0px";
  imageElement.style.height = "44px";
  imageElement.style.width = "50px";
  imageElement.style.marginRight = "6px";
  imageElement.style.borderStyle = "solid";
  imageElement.style.borderColor = "#82ae4c";
  imageElement.style.borderWidth = "2px";

  // Create the overlay
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.zIndex = "9999"; // A higher value to appear on top of the canvas

  // Append the image to the overlay
  overlay.appendChild(imageElement);

  // Add event listener to the Leroy image to show the popup window when clicked
  imageElement.addEventListener("click", showPopupWindow);

  document.body.appendChild(overlay);
  return overlay;
}

// Function to show the popup window
function showPopupWindow() {
    // Create the popup window
    const popupWindow = document.createElement("div");
    popupWindow.classList.add("popup-window"); // Add the 'popup-window' class to the popup window
    popupWindow.style.position = "fixed";
    popupWindow.style.top = "50%";
    popupWindow.style.left = "50%";
    popupWindow.style.transform = "translate(-50%, -50%)";
    popupWindow.style.backgroundColor = "white";
    popupWindow.style.padding = "20px";
    popupWindow.style.border = "1px solid black";
    popupWindow.style.zIndex = "10000";
    popupWindow.style.color = "black"; // Set the text color to black
  
    // Create the header with close option (X button)
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.borderBottom = "1px solid #ccc"; // Add a border to separate the header from the content
  
    const closeButton = document.createElement("span");
    closeButton.textContent = "X";
    closeButton.style.cursor = "pointer";
    closeButton.style.fontSize = "16px";
    closeButton.style.fontWeight = "bold";
    closeButton.style.color = "red"; // Set the "X" color to red
    closeButton.style.marginRight = "10px";
  
    // Add event listener to close the popup when the close button is clicked
    closeButton.addEventListener("click", () => {
      document.body.removeChild(popupWindow);
    });
  
    header.appendChild(closeButton);
    popupWindow.appendChild(header);
  
    // Add content to the popup window (you can customize this)
    const content = document.createElement("div");
    content.innerHTML = '<h1>Welcome to the FoE-GBT Menu!</h1>';
    popupWindow.appendChild(content);
  
    // Append the popup window to the body
    document.body.appendChild(popupWindow);
  
    // Function to close the popup window when clicked
    function closePopupWindow() {
      document.body.removeChild(popupWindow);
    }
  
    // Close the popup window when clicked anywhere outside the window
    overlay.addEventListener("click", closePopupWindow);
    popupWindow.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }

// Call the checkInjection function when the document is ready
document.addEventListener("DOMContentLoaded", () => {
  checkInjection();

 
  const htmlFileUrl = chrome.runtime.getURL("html/popup2.html");
  loadHtmlFile(htmlFileUrl)
    .then((htmlContent) => {
      insertHtmlIntoPage(htmlContent);
    })
    .catch((error) => {
      console.error(error);
    });

  // Adjust overlay position if the game uses iframes
  const gameIframe = document.querySelector("iframe"); // Update this selector based on the actual iframe element used by the game
  if (gameIframe) {
    const iframeRect = gameIframe.getBoundingClientRect();
    overlay.style.top = iframeRect.top + "px";
    overlay.style.left = iframeRect.left + "px";
  }
});
