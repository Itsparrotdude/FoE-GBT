// // Define the function to save JSON data to local storage
// function saveJsonDataToLocalStorage(key, data) {
//   try {
//     const jsonData = JSON.stringify(data);
//     localStorage.setItem(key, jsonData);
//   } catch (error) {
//     console.error('Error saving JSON data to local storage:', error);
//   }
// }

// // Intercept network responses and save JSON data to local storage
// chrome.webRequest.onCompleted.addListener(
//   function (details) {
//     // Customize this part to determine when and which JSON data you want to save
//     if (details.responseData) {
//       saveJsonDataToLocalStorage('someKey', details.responseData);
//     }
//   },
//   { urls: ['https://*.forgeofempires.com/game/json?h=*'] },
// );
