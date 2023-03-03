window.addEventListener("click", notifyExtension);
console.info("sexy-tofu extenstion start to inject content.js...");

var OnCartItemsChange = async (array) => {
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

/* The InstaCart Cart "button" consists of 3 parts: a path, a span, and an svg (the cart icon). This function verifies that the 
"button" was clicked by checking if the target of user click had the attribute of any of these three parts.
*/
function notifyExtension(e) {
    let cartUI = document.querySelector('div[aria-label="Cart"]');
    let notInCartUI = cartUI?.hasAttribute('hidden') || cartUI?.style.display == 'none';
    let target = e.target;
    let tagName = target?.tagName?.toLowerCase();

    if (!notInCartUI && tagName == 'img') {
        target = target.parentElement;
        if (target.className == 'RetailerLogo') {
            delayPrintCart();
            return;
        }
    }
    else if (tagName != 'span' && tagName != 'button' && tagName != 'svg' && tagName != 'path') {
        return;
    }

    let max = 3, i = 0;
    while (target?.tagName?.toLowerCase() !== 'button') {
        target = target?.parentElement;
        i++;
        if (target == null || i > max) {//sometimes, click area remove from UI, so no parent.
            break;
        }
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
        ariaLabel?.includes("decrement") || target.outerText == 'remove') {
        delayPrintCart();
    }
}

async function delayPrintCart() {
    //set isCalc first.
    chrome.runtime.sendMessage({
        action: 'isCalcuating'
    })

    setTimeout(printCart, 5000); // to make sure DOM elements load. may change to MutationObserver()
}

function printCart() {
    var items = document.querySelectorAll('div[aria-label="product"]');
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
                console.error('read cart item error:', textNode.outerHTML);
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