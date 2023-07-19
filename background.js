// // Listen for network requests
// chrome.webRequest.onCompleted.addListener(
//     (details) => {
//       // Check if the response contains the JSON data you want to save
//       if (details.responseType === 'json' && details.url === 'https://en17.forgeofempires.com/game/json?h=vYVJPX_8PiJWoxNa7dconUdC') {
//         const jsonData = details.response; // The JSON data from the response
//         saveJsonData(jsonData); // Call a function to save the JSON data
//       }
//     },
//     { urls: ['https://en17.forgeofempires.com/game/json?h=vYVJPX_8PiJWoxNa7dconUdC'] }
//   );
  
  
//   // Function to save JSON data using chrome.storage.local
//   function saveJsonData(data) {
//     // Save the JSON data into the browser's local storage
//     chrome.storage.local.set({ myData: data }, () => {
//       console.log('Data saved to local storage:', data);
//     });
//   }
  
  chrome.webRequest.onCompleted.addListener(
    (details) => {
      // Check if the response contains the JSON data you want to save
      if (details.responseType === 'json' && details.url === 'https://en17.forgeofempires.com/game/json?h=vYVJPX_8PiJWoxNa7dconUdC') {
        const jsonData = details.response; // The JSON data from the response
        saveJsonDataToLocalStorage(jsonData); // Call a function to save the JSON data
      }
    },
    { urls: ['https://en17.forgeofempires.com/game/json?h=vYVJPX_8PiJWoxNa7dconUdC'] }
  );
  
  function saveJsonDataToLocalStorage(data) {
    try {
      // Convert the JSON data to a string and save it to local storage
      localStorage.setItem('myJsonData', JSON.stringify(data));
      console.log('JSON data saved to local storage:', data);
    } catch (error) {
      console.error('Error saving JSON data to local storage:', error);
    }
  }
  