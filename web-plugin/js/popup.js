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

let timerCalc = null;
let i = 0;

if (isEmpty) {
  loadCarbonImpact();
}
else {
  timerCalc = setTimeout(() => { checkIsCalc() }, 1000);
}

async function checkIsCalc() {
  let { isCalc } = await chrome.storage.local.get("isCalc");

  if (isCalc) {
    timerCalc = setTimeout(() => { checkIsCalc() }, 100);
  } else {
    loadCarbonImpact();
    clearTimeout(timerCalc);
  }
}

async function loadCarbonImpact() {
  try {
    let { impacts } = await chrome.storage.local.get("impacts");

    let status = STATUS.Empty;
    if (impacts) {
      console.info("Total Impacts:", impacts.totalImpact);
      console.info("Total Cost:", impacts.offsetCost);
      //console.info("cartItems", impacts.cartItems);

      status = impacts.cartStatus;

      if (status == STATUS.Empty) {
        if (isEmpty) {
          let h2 = document.querySelector('h2');
          h2.textContent = "Your cart has no food in it";
        }
        else {
          this.location.href = 'empty.html';
        }
      }
      else if (status == STATUS.HaveFood) {
        if (isOffset) {
          let bubbleTxt = document.querySelector('#bubbleTxt');
          let offsetBtn = document.querySelector('#paymentBtn');

          if (bubbleTxt) {
            bubbleTxt.textContent = "Here's the carbon emission for your cart!";
          }
          if (offsetBtn) {
            offsetBtn.toggleAttribute("disabled");
          }
          buildItem(impacts)
        }
        else {
          this.location.href = 'offset.html';
        }
      }
    }
  }
  catch {
    console.error('Load local storage failed. Not working in extension mode?');
  }
}

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

closeBtn = document.querySelector('.CloseBtn');
if (closeBtn) {
  closeBtn.addEventListener('click', async () => {
    self.close();
  });
}

let backBtn = document.querySelector('.backBtn');
if (backBtn) {
  backBtn.addEventListener('click', async () => {
    console.warn('retry action to get data in backend: message: Refresh');
    chrome.runtime.sendMessage({
      action: 'Refresh',
    })
    self.close();
  });
}