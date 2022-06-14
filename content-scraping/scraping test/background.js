// chrome.browserAction.onClicked.addListener(function(tab) {

    // chrome.action.onClicked.addListener((tab) => {
    //     chrome.scripting.executeScript({
    //       target: { tabId: tab.id },
    //       files: ['content.js']
    //     });
    //   });
    //chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
        // chrome.browserAction.onClicked.addListener(function(tab) {
        //     chrome.tabs.executeScript(null, {file: "content.js"});
        //   //  chrome.browserAction.onClicked.removeListener();
        // });
      //});
      let cartButton = document.querySelector('button[aria-label*="View Cart"]');
      console.log(cartButton);

      cartButton.addEventListener("click", function() {
        chrome.tabs.executeScript(null, {file: "content.js"});
   });
    //     // Send a message to the active tab
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       var activeTab = tabs[0];
//       chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
//     });
//   });