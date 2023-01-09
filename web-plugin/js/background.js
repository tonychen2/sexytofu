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

const GHGI_API_ADDRESS = 'https://api.sexytofu.org/api.ghgi.org:443';

// TODO： hardcode the cart items here first. the data should transfer from content JS.
//Now read cart items in popup page,
//but due to we directly show the totcal carbon affect in popup page, so we can read from storage in backend js.
//and send reqeust to get the impact.
let searchList = [
    {
        quantity: 3,
        unit: 'pound',
        ingredient: 'tofu'
    },
    {
        quantity: 2,
        unit: 'pound',
        ingredient: 'chicken'
    },
];

//below codes all from sexy-tofu front-end code.
//https://github.com/tonychen2/sexy-tofu/blob/94591e6d6cdc6c7616d9dd6728fc586c3004ea20/frontend/src/App.js#L78
// Convert grocery list into a format consumable by the GHGI API
for (let i = 0; i < searchList.length; i++) {
    let food = searchList[i];
    if (food["unit"] === "ea") {
        searchList[i] = `${food["quantity"]} ${food["ingredient"]}`;
    } else {
        searchList[i] = `${food["quantity"]} ${food["unit"]} of ${food["ingredient"]}`;
    }
}

(async function(){
    let results = await fetch(`${GHGI_API_ADDRESS}/rate`,
    {
        method: 'POST',
        body: JSON.stringify({ 'recipe': searchList })
    })
    .then(response => response.json())
    .then(json => this.parseResponse(json));

    console.log(results);
}())


parseResponse = async (json) => {
    /**
     * Parse response from GHGI API to access data points for display
     *
     * @param    {String} json      Response body in json format
     *
     * @return   {Object}  Requested data points
     */

    let ingredients = [];
    // Find impact of each ingredient and rank them
    for (let item of json["items"]) {
        let impact, product;
        if (item["match_conf"] >= 0.5) {
            impact = item["impact"] / 1000 * 2.2; // Convert from grams to pounds
            product = item["product"]["alias"];
        } else {
            impact = null;
            product = null;
        }
        ingredients.push({
            name: item["names"][0],
            product: product,
            matched: Boolean(item["match_conf"] >= 0.5),
            impact: impact,
            grams: item["g"]
        });
    }
    ingredients.sort((a, b) => b.impact - a.impact);
    let totalImpact = ingredients.reduce((acc, curr) => acc + curr.impact, 0);

    let contributors = [];
    let impacts = [];
    let grams = [];
    for (let item of ingredients) {
        contributors.push(item.name);
        impacts.push(item.impact);
        grams.push(item.grams);
    }

    return {
        matched: ingredients.reduce((acc, curr) => acc || curr.matched, false),
        totalImpact: totalImpact,
        contributors: contributors,
        impacts: impacts,
        grams: grams,
    };
}
