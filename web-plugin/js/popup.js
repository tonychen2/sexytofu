let cartItems = null;
const carbonEmission = document.querySelector('div[class="child one"]');
const carbonCost = document.querySelector('div[class="child two"]');
let pageUrl = window.location.pathname;

//TODO: split pages & js files.
const isOffset = pageUrl.toLowerCase().endsWith('/offset.html');
const isEmpty = pageUrl.toLowerCase().endsWith('/empty.html');

//let bgPage = chrome.extension.getBackgroundPage();
//V2 function... not working anymore.
//link: https://developer.chrome.com/docs/extensions/mv3/mv3-migration-checklist/#api-background-context

try {
  chrome.storage.local.onChanged.addListener((changes) => {
    loadCarbonImpact();
  })
}
catch {
  console.error('Add local onChanged listener failed. Not working in extension mode?');
}

async function loadCarbonImpact() {
  try {
    let { impacts = [] } = await chrome.storage.local.get("impacts");

    let status = STATUS.Empty;
    if (impacts) {
      console.info("Total Impacts:", impacts.totalImpact);
      console.info("Total Cost:", impacts.offsetCost);
      //console.info("cartItems", impacts.cartItems);

      status = impacts.cartStatus;
      if (status == STATUS.Empty) {
        let h2 = document.querySelector('h2');
        h2.textContent = "Your cart has no food in it";
      }
      else if (status == STATUS.HaveFood) {
        buildItem(impacts)
      }
    }
  }
  catch {
    console.error('Load local storage failed. Not working in extension mode?');
  }
}

loadCarbonImpact();

//TODO: this need move to some other js file...
function buildItem(impacts) {
  if (isOffset) {
    let pEmission = document.querySelector('div[class="child one"] span');
    pEmission.innerText = impacts.totalImpact.toFixed(1);

    let pCost = document.querySelector('div[class="child two"] span');
    pCost.innerText = '$' + impacts.offsetCost.toFixed(2);
  }
}

let leanMoreBtn = document.querySelector('#leanMoreBtn');
if (leanMoreBtn) {
  leanMoreBtn.addEventListener('click', async () => {
    //we can jump in extension pages. but open third-party page must open new tabs.
    // this.location.href = 'payment-success.html';
    chrome.tabs.create({
      url: 'https://info.sexytofu.org/'
    });
  });
}

let paymentBtn = document.querySelector('#paymentBtn');
if (paymentBtn) {
  paymentBtn.addEventListener('click', async () => {
    //we can jump in extension pages. but open third-party page must open new tabs.
    // this.location.href = 'payment-success.html';
    chrome.tabs.create({
      url: 'https://marketplace.goldstandard.org/collections/projects'
    });
  });
}

let closeBtn = document.querySelector('.close');
if (closeBtn) {
  closeBtn.addEventListener('click', async () => {
    self.close();
  });
}

let backBtn = document.querySelector('.backBtn');
if (backBtn) {
  backBtn.addEventListener('click', async () => {
    console.warn('TODO: some retry action to get data in backend?');
  });
}