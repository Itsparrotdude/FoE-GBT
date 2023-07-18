// inject.js

// Define the scripts variable at the beginning
let scripts = {
    main: ["once", "primed"],
    proxy: ["once", "primed"],
    vendor: ["once", "primed"],
    internal: ["once", "primed"]
  };
  
  function promisedLoadCode(src, base = "base") {
    return new Promise(async (resolve, reject) => {
      let sc = document.createElement("script");
      sc.src = src;
      if (scripts[base]) {
        scripts[base].push(src);
      }
      sc.addEventListener("load", function () {
        if (scripts[base]) scriptLoaded(src, base);
        this.remove();
        resolve();
      });
      sc.addEventListener("error", function () {
        console.error("Error loading script " + src);
        this.remove();
        reject();
      });
      while (!document.head && !document.documentElement)
        await new Promise((resolve) => {
          // @ts-ignore
          requestIdleCallback(resolve);
        });
      (document.head || document.documentElement).appendChild(sc);
    });
  }
  
  function scriptLoaded(src, base) {
    scripts[base].splice(scripts[base].indexOf(src), 1);
    if (scripts.internal.length == 1) {
      scripts.internal.splice(scripts.internal.indexOf("once"), 1);
      window.dispatchEvent(new CustomEvent("foe-helper#loaded"));
    }
    // Add more logic to handle other events if needed
  }
  
  function inject(loadBeta = false, extUrl = chrome.runtime.getURL(""), betaDate = "") {
    // Your implementation of the inject function
    // ...
    
    // Call your promisedLoadCode function to load scripts
    promisedLoadCode(extUrl + "js/content.js").then(() => {
      // Script loaded successfully, you can execute any code that depends on the loaded script here.
      console.log("Content.js has been successfully injected!");
    });
    
    // ...
  }
  
  // Call the inject function when the document is ready
  document.addEventListener("DOMContentLoaded", inject);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "getImageUrl") {
      const imageUrl = chrome.runtime.getURL("images/leroy.png");
      sendResponse({ imageUrl: imageUrl });
    }
  });
  
