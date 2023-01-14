console.log("start for demo.html");

var OnCartItemsChange = async (array) => {
    //send message or just use storage?
    console.log(`storage set items:`);
    console.log(array);
    await chrome.storage.sync.set({ items: array });
}

let cartItems = [];

//for demo page, need reload the storage when reload.
(async function () {
    let { items = [] } = await chrome.storage.sync.get("items");
    cartItems = items;
}());

let addButton = document.querySelector("#addItem");
let nameInput = document.querySelector("#name");
let weightInput = document.querySelector("#quan");

addButton.addEventListener('click', () => {
    if (nameInput.value?.length > 0 && weightInput.value?.length > 0) {
        var item = new TofuItem(nameInput.value, "ea", `${weightInput.value}`);
        cartItems.push(item);
        OnCartItemsChange(cartItems);
    }
});

let ClearButton = document.querySelector("#clear");

ClearButton.addEventListener('click', () => {
    cartItems = [];
    OnCartItemsChange(cartItems);
});

let bageTxt = document.querySelector("#bageText");
let bageTxtBtn = document.querySelector("#setText");
let bageColor = document.querySelector("#bageColor");
let bageColorBtn = document.querySelector("#setColor");

bageTxtBtn.addEventListener('click', () => {
    let text = bageTxt.value?.trim();
    chrome.action.setBadgeText({ text: text });
    console.log(`Update bage text to: ${text}`);
})

//input 225,225,225,225/0
function formatColor(color) {
    return `#${color[0]}${color[1]}${color[2]}`;
}

bageColorBtn.addEventListener('click', async () => {
    let uiText = bageTxt.value;
    let bageShowText = await chrome.action.getBadgeText({});
    let uiEmpty = uiText?.length == 0;
    if (uiEmpty){
        uiText = bageShowText;
        bageTxt.value = uiText;
    }

    if (uiEmpty || uiText != bageShowText) {
        if(uiEmpty) bageTxt.value = '(^_*)';
        bageTxtBtn.click();
    }

    // Next, generate a random RGBA color
    let color = [0, 0, 0].map(() => Math.floor(Math.random() * 255).toString(16).toUpperCase());
    let colorStr = formatColor(color);

    chrome.action.setBadgeBackgroundColor({ color: colorStr });
    bageColor.value = colorStr;
});

