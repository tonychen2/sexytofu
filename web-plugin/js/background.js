chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        //here we need a page outside of the extension to collect feedback.
        chrome.runtime.setUninstallURL("https://www.bing.com");
    }
});

function setBadge(message) {
    var popupFile = `./popup/${message.cartStatus}.html`;

    chrome.action.setPopup({ popup: popupFile });
    let text = message.cartCount.toString();
    if (text == '0') {
        { chrome.action.setBadgeText({ text: '' }); }
    }
    else { chrome.action.setBadgeText({ text }); }
}

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    //seems this not a good way to transfer data, due to need content.js post again & agian, or we can't get it.
    //HandleCartItemChange(message.action, message.data);
    if (message.cartStatus) {
        setBadge(message)
        sendResponse(`message received: ${message.cartStatus}`);
    }
    else if (message.action) {
        //sendResponse(`onMessage: request received: ${message.action}`);
        switch (message.action) {
            case "get":
                //TODO: build url with message.data?
                url = "https://www.sexytofu.org/";
                //await getData("https://www.sexytofu.org/", sendResponse);
                var response = await fetch(url);
                var result = await response.text();
                await sendResponse(result);
                break;
            case "post":
                //need build post data with message.data;
                await postData("https://www.sexytofu.org/", message.data, sendResponse);
                break;
            default:
                //not support so far.
                break;
        }

    }
});

//below codes want to reuse in popup with getBackgroundPage(), but failed.
async function getData(url, callback) {

};

async function postData(url, data, callback) {
    fetch(url).then(r => r.text()).then(result => { callback(result); });
    var response = await fetch(url, {
        method: "POST",
        body: data
    });
    var result = await response.text();
    await callback(result);
};

function Test() {
    console.log("ddddd")
};

// //is it OK to send back message to popup? bad designe...
// function sendResponse(resultData) {
//     chrome.runtime.sendMessage({
//         data: resultData,
//     }, function (response) {
//         console.log(response);
//     })
// }