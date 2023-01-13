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
//let bgPage = chrome.extension.getBackgroundPage();
//V2 function... not working anymore.
//link: https://developer.chrome.com/docs/extensions/mv3/mv3-migration-checklist/#api-background-context

(async function () {
  //read carbonEmission
  let { impacts = [] } = await chrome.storage.local.get("impacts");
  console.log("impacts:")
  console.log(impacts);
  if (isOffset) {
    buildItem(impacts)
  }
}())

function buildItem(impacts) {
  if (isOffset) {
    let pEmission = document.createElement('span');
    pEmission.setAttribute('style', 'font-size: 20px');
    pEmission.innerText = impacts.totalImpact.toFixed(1);
    carbonEmission.append(pEmission);
    
    let co2Lable = document.createElement('span');
    co2Lable.setAttribute('style', 'color:gray');
    co2Lable.innerText = " lbs of CO2";
    carbonEmission.append(co2Lable);

    let pCost = document.createElement('span');
    pCost.setAttribute('style', 'font-size: 20px');
    pCost.innerText = impacts.offsetCost.toFixed(2);
    carbonCost.append(pCost);

    console.log(`add item to the cartInfo div.`);
  }
}