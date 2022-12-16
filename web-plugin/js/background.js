chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        //here we need a page outside of the extension to collect feedback.
        chrome.runtime.setUninstallURL("https://www.bing.com");
    }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    //seems this not a good way to transfer data, due to need content.js post again & agian, or we can't get it.
    //HandleCartItemChange(message.action, message.data);
    var popupFile = `./popup/${message.cartStatus}.html`;

    chrome.action.setPopup({ popup: popupFile });
    let text = message.cartCount.toString();
    if (text == '0') {
        { chrome.action.setBadgeText({ text: '' }); }
    }
    else { chrome.action.setBadgeText({ text }); }
    sendResponse(`message received: ${message.cartStatus}`);
});

