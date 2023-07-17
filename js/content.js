// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (message) {
    if (message.action === "show_popup") {
      // Create a new popup window
      const popup = window.open(chrome.runtime.getURL("popup.html"), "HelloPopup", "width=300,height=200");
      if (popup) {
        // Focus the popup if it was successfully created
        popup.focus();
      }
    }
  });
  
  // Send a message to the background script to trigger the popup
  chrome.runtime.sendMessage({ action: "show_popup" });
  