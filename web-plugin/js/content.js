window.addEventListener("click", notifyExtension);
console.info("sexy-tofu extenstion start to inject content.js...");

OnCartItemsChange = async (array) => {
    //send message or just use storage?
    console.log('current cart items:');
    console.table(array);

    //add time flag for clear cache after outdated. now: 24h.
    let carts = {
        items: array,
        timestamp: Date.now()
    }
    await chrome.storage.sync.set({ carts: carts });
}

function setOutDated(isOutDated) {
    chrome.runtime.sendMessage({
        action: isOutDated ? 'OutDated' : 'Normal'
    })
}

function getTargetbyType(item, tagType) {
    let max = 3, i = 0;
    while (item?.tagName?.toLowerCase() !== tagType) {
        item = item?.parentElement;
        if (item == null || i > max) {//sometimes, click area remove from UI, so no parent.
            return null;
        }
        i++;
    }
    return item;
}

/* The InstaCart Cart "button" consists of 3 parts: a path, a span, and an svg (the cart icon). This function verifies that the 
"button" was clicked by checking if the target of user click had the attribute of any of these three parts.
*/
//TODO: re-org, how to orgnize the button types?
function notifyExtension(e) {
    let target = e.target;
    let origTagName = target?.tagName?.toLowerCase();

    target = getTargetbyType(target, 'button');
    let isRetailBtn = target?.querySelector(".RetailerLogo") ? true : false;

    if (isRetailBtn) {
        // Re-scrape if user goes to a different retailer's cart
        waitThenScrapeCart();
        return;
    }
    else if (origTagName != 'span' && origTagName != 'button' && origTagName != 'svg' && origTagName != 'path') {
        return;
    }

    console.info('Button Clicked: ', target ? target.outerHTML : '(button removed.)');

    let ariaLabel = target?.getAttribute("aria-label")?.toLowerCase();
    let btnText = target?.outerText.toLowerCase();
    let isHomePage = window.location.pathname.trim().toLowerCase().endsWith('/store');

    if (isCartUIVisible()) {
        //view cart click, before function call, the UI attribute is in cart.
        if ((!isHomePage && ariaLabel?.includes("view cart")) || ariaLabel?.includes("increment") ||
            ariaLabel?.includes("decrement") || ariaLabel?.includes("remove") || btnText == 'remove') {
            waitThenScrapeCart();
        }
    }
    else if (ariaLabel?.includes("add") || ariaLabel?.includes("remove")
        || ariaLabel?.includes("increment") || ariaLabel?.includes("decrement")
        || target == null || btnText == 'Add to cart' || btnText == 'Update quantity') {
        //inform need open cart again.
        console.info('Need reopen the cart again!')
        setOutDated(true);

    }
}

function isCartUIVisible() {
    //$('div[aria-label="Cart"]:visible'), get visible cart obj
    return $('div[aria-label="Cart"]').is(':visible');
}

//Init the retryTimes.
async function resetRetryCount() {
    retryTimes = 0;
}

let retryTimes = -1;
const MAX_RETRY = 30; // 300 * 30 = 9s. total around 9.5s
let scrapeTimer = null;

async function waitThenScrapeCart(timeout = 500) {
    clearTimeout(scrapeTimer);//cancel the before timer first.
    console.log(`Go to read  carts, wait ${timeout}ms first: ${new Date().toLocaleString()}`);

    //This used to handle when cartBody can't load out, maybe network error and so on.
    retryTimes = 0;

    scrapeTimer = setTimeout(scrapeCart, timeout);
}

function scrapeCart(timeoutBeforeRetry = 300) {
    //if user have exit the cart, need set OutDated.
    if (!isCartUIVisible()) {
        console.log("User exit the cart UI, we can't read cart items now...")
        setOutDated(true);
        return;
    }

    //here to make sure cartbody is loaded.
    if (!$('div[id="cart-body"]').is(':visible')) {
        if (retryTimes > MAX_RETRY) {
            console.error(`Cart Body still not ready. currentTime: ${new Date().toLocaleString()}`);
            return;
        }

        console.log(`Cart Body not ready, wait ${timeoutBeforeRetry}ms again: ${new Date().toLocaleString()}`);
        scrapeTimer = setTimeout(scrapeCart, timeoutBeforeRetry);
        retryTimes++;
        return;
    }

    console.log(`Print start: ${new Date().toLocaleString()}`);
    let items = document.querySelectorAll('div[aria-label="product"]');
    let cartItems = [];
    setOutDated(false);

    for (i = 0; i < items.length; ++i) {
        item = items[i];

        //TODO: add error report, send mail or let user send feedback?
        //TODO: still need improve logic for reading the cart items...
        if (item.childElementCount == 2) {
            textNode = item.firstChild.lastChild.firstChild;

            try {
                foodName = textNode.firstChild.firstChild.textContent;
                unit = textNode.firstChild.lastChild.textContent;
                quantity = textNode.firstChild.nextElementSibling.textContent;

                let food = BuildFoodItem(foodName, unit, quantity)
                cartItems.push(food);
            }
            catch {
                console.warn('read cart item error:', textNode.outerHTML);
            }
        }
        else {
            // Alternative logic as a backup
            allTextContent = item.textContent;
            console.error("TODO: read cart item failed: ", allTextContent);

            // TODO: Parse text content
            // TODO: Send notification
        }
    }
    OnCartItemsChange(cartItems);
}

function BuildFoodItem(foodName, unit, quantity) {
    if (unit) {
        let numb = parseFloat(unit);
        if (numb) {
            // console.log(`before unit: ${unit}, quantity: ${quantity}`);
            quantity = numb * quantity;
            unit = unit.replace(numb, '').trim().toLowerCase();

            //remove container words, like: bag, container, count ...
            UNIT_RemoveWords.forEach((word) => {
                unit = unit?.replace(word, "").trim();
            });

            //convert some speical unit, like: fl oz, ct, oz bunch
            if (UNIT_Convert[unit]) {
                unit = UNIT_Convert[unit];
            }

            // console.log(`after unit: ${unit}, quantity: ${quantity}`);
        }
        else if (unit == 'each' || unit.startsWith("per ")) {
            unit = "ea";
        }
    }

    return {
        name: foodName,
        quantity: quantity,
        unit: unit
    };
}