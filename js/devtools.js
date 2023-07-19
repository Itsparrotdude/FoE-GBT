chrome.devtools.network.onRequestFinished.addListener((request) => {
    // Check if the request's response contains JSON data
    if (request.response.content.mimeType === 'json') {
      request.getContent((content) => {
        const jsonData = JSON.parse(content);
        localStorage.setItem('myJsonData', JSON.stringify(jsonData));
        console.log('JSON data saved to local storage:', jsonData);
      });
    }
  });
  
  