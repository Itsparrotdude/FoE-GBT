console.log("background.js has been successfully injected!")

// background.js
chrome.webRequest.onCompleted.addListener(
  function (details) {
    if (details.responseHeaders) {
      const contentTypeHeader = details.responseHeaders.find(
        (header) => header.name.toLowerCase() === "content-type"
      );
      if (contentTypeHeader && contentTypeHeader.value.includes("application/json")) {
        // Extract JSON data from the response body
        const responseText = new Uint8Array(details.responseBody?.raw[0]?.bytes);
        if (responseText) {
          const jsonString = new TextDecoder().decode(responseText);
          try {
            const jsonData = JSON.parse(jsonString);
            // Save the jsonData to local storage
            // You can use the "chrome.storage.local" API to save the data
            // For example:
            chrome.storage.local.set({ key: jsonData }, function() {
              console.log("Data saved to local storage:", jsonData);
            });
          } catch (error) {
            console.error("Error parsing JSON data:", error);
          }
        }
      }
    }
  },
  { urls: ["<all_urls>"], types: ["xmlhttprequest"] }
);
