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
  imageElement.style.marginRight = "8px";
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
  document.body.appendChild(overlay2);
  return overlay;
}

// Function to show the popup window
function showPopupWindow() {
  // Create the popup window
  const popupWindow = document.createElement("div");
  popupWindow.classList.add("popup-window", "silde-up"); // Add the 'popup-window' class to the popup window
  popupWindow.style.position = "fixed";
  popupWindow.style.top = "20%";
  popupWindow.style.left = "26%";
  popupWindow.style.backgroundColor = "white";
  popupWindow.style.padding = "20px";
  popupWindow.style.border = "1px solid black";
  popupWindow.style.zIndex = "10001"; // Set the zIndex to a higher value
  popupWindow.style.color = "black"; // Set the text color to black
  popupWindow.style.backgroundColor = "blue";
  popupWindow.style.marginRight = "6px";
  popupWindow.style.height = "50%";
  popupWindow.style.width = "50%";
 

  // Create the image element for the settingsimage`
  const imageElement2 = document.createElement("img");
  imageElement2.src = chrome.runtime.getURL("images/settingsimage.png");
  imageElement2.style.position = "absolute";
  imageElement2.style.top = "20%";
  imageElement2.style.left = "30%";
  imageElement2.style.height = "40px";
  imageElement2.style.width = "41px"; 
  imageElement2.style.marginRight = "3px";
  imageElement2.style.zIndex = "10002"; // Set the zIndex to be higher than

  imageElement2.addEventListener("click", showPopupWindow2)

  function showPopupWindow2() {
    const popupWindow2 = document.createElement("div");
    popupWindow2.classList.add("popup-window2");
    popupWindow2.style.position = "fixed";
    popupWindow2.style.top = "82%";
    popupWindow2.style.left = "98.2%";
    popupWindow2.style.transform = "translate(-50%, -50%)";
    popupWindow2.style.backgroundColor = "black";
    popupWindow2.style.zIndex = "10002"; // Set the zIndex to be higher than popupWindow


    const closeButton2 = document.createElement("span");
    closeButton2.textContent = "X";
    closeButton2.style.cursor = "pointer";
    closeButton2.style.fontSize = "16px";
    closeButton2.style.fontWeight = "bold";
    closeButton2.style.color = "red"; // Set the "X" color to red
    closeButton2.style.marginRight = "10px";


    // document.body.appendChild(popupWindow2);

    // const content2 = document.createElement("div");
    // popupWindow2.appendChild(content2);

    

    function closePopupWindow2(){
      document.body.removeChild(popupWindow2);
    }

    

    overlay.addEventListener("click", closePopupWindow2);
    popupWindow2.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    closeButton2.addEventListener("click", () => {
      document.body.removeChild(popupWindow2);
      
    });

    // Create the overlay
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.zIndex = "9999"; // A higher value to appear on top of the canvas


  // Append the image to the overlay
  overlay.appendChild(imageElement);
 

  // Add event listener to the Leroy image to show the popup window when clicked
  imageElement.addEventListener("click", showPopupWindow);

  document.body.appendChild(overlay);
  document.body.appendChild(overlay2);
  return overlay;
    
  }
    
  
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
    document.body.removeChild(imageElement2)
  });

  header.appendChild(closeButton);
  popupWindow.appendChild(header);

  // Add content to the popup window (you can customize this)
  const content = document.createElement("div");
  // content.innerHTML = '<h1>Welcome to the FoE-GBT Menu!</h1>';
  popupWindow.appendChild(content);

  // Append the popup window to the body
  document.body.appendChild(popupWindow);
  document.body.appendChild(imageElement2);
  

  // Function to close the popup window when clicked
  function closePopupWindow() {
    document.body.removeChild(popupWindow);
  }

  

  // Close the popup window when clicked anywhere outside the window
  overlay.addEventListener("click", closePopupWindow);
  popupWindow.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  setTimeout(() => {
    popupWindow.classList.remove("slide-up");
  }, 10);
  }

  

// Call the checkInjection function when the document is ready
document.addEventListener("DOMContentLoaded", () => {
  checkInjection();

  const htmlFileUrl = chrome.runtime.getURL("html/popup.html");
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

buttonClicked = false

const blueBar = document.getElementById("buttonClicked")

function save() {
  if (localStorage.getItem('data') == null) {
    // Replace data1, data2, and data3 with your actual JSON data or variables
    const data1 = { key: 'value1' };
    const data2 = { key: 'value2' };
    const data3 = { key: 'value3' };

    // Create an array containing your data objects
    const dataArray = [data1, data2, data3];

    // Convert the array to JSON format
    const jsonData = JSON.stringify(dataArray);

    // Save the JSON data into local storage
    localStorage.setItem('data', jsonData);
  }
}