let cartItems = null;
let pageUrl = window.location.pathname;

const isOffset = pageUrl.toLowerCase().endsWith('/offset.html');
const isEmpty = pageUrl.toLowerCase().endsWith('/empty.html');

//let bgPage = chrome.extension.getBackgroundPage();
//V2 function... not working anymore.
//link: https://developer.chrome.com/docs/extensions/mv3/mv3-migration-checklist/#api-background-context

let waitCalcuatingTimer = null;
let startTime = Date.now();
let isCalcuating;
let retry = 0;
let targetSize = 12, maxSize = 50;
let isDesc = false;
let timer;
let isCenter = true;

(async () => {
  if (isEmpty) {
    loadCarbonImpact();
  }
  else {
    isCalcuating = (await chrome.storage.local.get("isCalcuating")).isCalcuating;
    if (isCalcuating) {
      waitCalcuatingTimer = setTimeout(() => { checkIsCalcuating() }, 1000);
    }
    else {
      loadCarbonImpact();
    }
  }
})()

async function checkIsCalcuating() {
  // console.log("time checkIsCalcuating: ", Date.now() - startTime);
  try {
    isCalcuating = (await chrome.storage.local.get("isCalcuating")).isCalcuating;
  } catch {
    //isCalcuating = retry++ < 10; //this is for hard test.
  }

  if (isCalcuating) {
    waitCalcuatingTimer = setTimeout(() => { checkIsCalcuating() }, 200);
  } else {
    loadCarbonImpact();
    clearTimeout(waitCalcuatingTimer);
  }
}

async function loadCarbonImpact() {
  //console.log("time loadCarbonImpact: ", Date.now() - startTime);
  try {
    let { impacts } = await chrome.storage.local.get("impacts");

    let status = STATUS.Empty;
    if (impacts) {
      console.info("Total Impacts:", impacts.totalImpact);
      console.info("Total Cost:", impacts.offsetCost);
      //console.info("cartItems", impacts.cartItems);

      status = impacts.cartStatus;

      if (status == STATUS.HaveFood) {
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

    //set empty when no data... normally only test meet this case.
    if (status == STATUS.Empty) {
      if (isEmpty) {
        let h2 = document.querySelector('h2');
        h2.textContent = "Your cart has no food in it";
      }
      else {
        this.location.href = 'empty.html';
      }
    }
  }
  catch (ex) {
    console.error('Load local storage failed. Exception as: \n', ex);
  }
}

function buildItem(impacts) {
  if (isOffset) {
    //stop the animation
    let dispVals = $(".loading").removeClass("loading").addClass("dispValue");
    $(dispVals[0]).text(impacts.totalImpact.toFixed(1));
    $(dispVals[1]).text('$' + impacts.offsetCost.toFixed(2));

    //For breakdown details
    impacts.cartItems.sort((a, b) => b.origImpact - a.origImpact).forEach(item => {
      let row = `<div class="row"><div class="col first">${item.name}</div>` + (
        item.matched ? `<div class="col">${item.impact.toFixed(1)}</div></div>` :
          `<div class="col notRec">Not recognized</div></div>`);

      $(".Data").append(row);
    });
    let total = $("div.total> div.col")[1];
    total.innerText = impacts.totalImpact.toFixed(1);
  }
}

let learnMoreBtn = document.querySelector('#learnMoreBtn');
if (learnMoreBtn) {
  learnMoreBtn.addEventListener('click', async () => {
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

//Normal X button
let closeBtn = document.querySelector('.close');
if (closeBtn) {
  closeBtn.addEventListener('click', async () => {
    self.close();
  });
}

//Outdated big Close button
closeBtn = document.querySelector('.CloseBtn');
if (closeBtn) {
  closeBtn.addEventListener('click', async () => {
    self.close();
  });
}

//Error page Refresh Button
let refreshBtn = document.querySelector('.refreshBtn');
if (refreshBtn) {
  refreshBtn.addEventListener('click', async () => {
    chrome.runtime.sendMessage({
      action: 'Refresh',
    })
    self.close();
  });
}

$(".displayDetail").click(() => {
  $(".DetailTable").show();
})

$(".detailClose").click(() => {
  $(".DetailTable").hide();
})
