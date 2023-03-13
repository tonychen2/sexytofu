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
function notifyExtension(e) {
    let cartUI = document.querySelector('div[aria-label="Cart"]');
    let notInCartUI = cartUI?.hasAttribute('hidden') || cartUI?.style.display == 'none';
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

    if (notInCartUI) {
        if (ariaLabel?.includes("add") || ariaLabel?.includes("remove")
            || ariaLabel?.includes("increment") || ariaLabel?.includes("decrement")
            || target == null || btnText == 'Add to cart' || btnText == 'Update quantity') {
            //inform need open cart again.
            console.info('Need reopen the cart again!')
            setOutDated(true);
        }
    }
    //view cart click, before function call, the UI attribute is in cart.
    else if ((!isHomePage && ariaLabel?.includes("view cart")) || ariaLabel?.includes("increment") ||
        ariaLabel?.includes("decrement") || ariaLabel?.includes("remove") || btnText == 'remove') {
        waitThenScrapeCart();
    }
}

let scrapeTimer = null;
async function waitThenScrapeCart(timeout = 500) {
    //set isCalc first.
    chrome.runtime.sendMessage({
        action: 'isCalcuating'
    })

    clearTimeout(timerPrint);//cancel the before timer first.
    console.log(`Go to read  carts, wait ${timeout}ms first: ${new Date().toLocaleString()}`);
    timerPrint = setTimeout(scrapeCart, timeout);
}

function scrapeCart(timeoutBeforeRetry=300) {
    //if user have exit the cart, need set OutDated.
    let cartUI = document.querySelector('div[aria-label="Cart"]');
    let notInCartUI = cartUI?.hasAttribute('hidden') || cartUI?.style.display == 'none';
    if (notInCartUI) {
        console.log("User exit the cart UI, we can't read cart items now...")
        setOutDated(true);
        return;
    }
    let cartBody = document.querySelector('div[id="cart-body"]');
    if (!cartBody) {//here to make sure cartbody is loaded.
        console.log(`Cart Body not ready, wait ${timeoutBeforeRetry}ms again: ${new Date().toLocaleString()}`);
        scrapeTimer = setTimeout(scrapeCart, timeoutBeforeRetry);
        return;
    }

    console.log(`Print start: ${new Date().toLocaleString()}`);
    let items = document.querySelectorAll('div[aria-label="product"]');
    // TODO: Consider refactor as foreach + callback
    let cartItems = [];
    setOutDated(false);
    for (i = 0; i < items.length; ++i) {
        item = items[i];

        if (item.childElementCount == 2) { // TODO: Improve logic for failure check
            //unit: 6 ct,  3 lb, per lb, each
            textNode = item.firstChild.lastChild.firstChild // TODO: Handle situation where this is not true

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
            unit = unit.replace(numb, '').trim();
            
            //remove container words, like: bag, container 
            unit = unit?.replace(" container", "")?.replace(" bag", "");
            if (UNIT_Convert[unit]) {
                unit = UNIT_Convert[unit];
            }

            // console.log(`after unit: ${unit}, quantity: ${quantity}`);
        }
        else if (unit == 'each' || unit.startsWith("per ")) {
            unit = "ea";
        }
    }

    return new TofuItem(foodName, unit, quantity);
}