// chrome.storage.sync.get(["item"]).then((result) => {
//   console.log(`get item: ${result.item}`);
//   values = result.item;
//   document.getElementById("texts").innerText = result.item;
// });
let cartItems = null;
const carbonEmission = document.querySelector('div[class="child one"]');
const carbonCost = document.querySelector('div[class="child two"]');
let pageUrl = window.location.pathname;
const isOffset = pageUrl.toLowerCase().endsWith('/offset.html');
const isEmpty = pageUrl.toLowerCase().endsWith('/empty.html');
const isNoFood = pageUrl.toLowerCase().endsWith('/no-food.html');
let bgPage = chrome.extension.getBackgroundPage();

var Init = async () => {
  let { items = [] } = await chrome.storage.sync.get("items");

  if (items) {
    postItems(items);
    items.forEach((item, index) => {
      console.log(`#Init-#item[${index}]: name: ${item.name} weight: ${item.weight}`);
      buildItem(item);
    });
  }
}

Init();

//normlay, when we action in Webpage, popup not open. so will not fire the onChanged message.
chrome.storage.sync.onChanged.addListener((changes) => {
  var items = changes.items.newValue;
  if (items?.length > 0) {
    postItems(items);
    console.log(`#onChanged: Now have ${items.length} items:`)
    items.forEach((item, index) => {
      console.log(`  item[${index}]: name: ${item.name} weight: ${item.weight}`);
    })
  }
  else {
    console.log(`Cart cleared.\n`);
  }
})

// //suppose the item is TofuItem.
// function HandleCartItemChange(action, item) {
//   console.log(`${action} items to cart: ${item}`);

//   switch (message.action) {
//     case "add":
//       //console.log("add items to cart.");
//       break;
//     case "delete":
//       //console.log("remove items from cart.");
//       break;
//     default:
//     //console.log("defualt, no action now.");
//   }
// }

function buildItem(item) {
  if (isOffset) {
    let pEmission = document.createElement('p');
    pEmission.setAttribute('style', 'font-size: 20px');
    pEmission.innerText = `${item.name} ${item.weight}lb`;
    carbonEmission.append(pEmission);

    let pCost = document.createElement('p');
    pCost.setAttribute('style', 'font-size: 20px');
    pCost.innerText = `#TODO`;
    carbonCost.append(pCost);

    console.log(`add item to the cartInfo div.`);
  }
}

function postItems(items) {
  //build items postdata.
  if (bgPage) {//null <---
    bgPage.postData("https://www.sexytofu.org/", "{test data}", callback);
  } else {
    //we can fetch here?
    // but can't POST...
    // fetch("https://www.sexytofu.org/", {
    //   //method: "POST",
    //   //body: { data: items }
    // }).then(r => r.text()).then(result =>{
    //   console.log(`We show return data to UI: ${result}`);
    // } );
    chrome.runtime.sendMessage({
      action: "get",
      data: items
    }, function (response) {
        console.log(response);//undefined <--- connect is broken.
    })
    //TODO: result is by item redraw carbon fee or total? need sync with page.
  }
}